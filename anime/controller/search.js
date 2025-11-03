import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// 智能模糊搜索API（支持分词、容错、同义词）
export const fuzzySearchAnime = (req, res) => {
  const {
    keyword,          // 关键词（必填）
    country,          // 国家筛选
    status,           // 状态筛选
    minLikes,         // 最小点赞数
    maxLikes,         // 最大点赞数  
    page = 1,         // 页码
    limit = 10,       // 每页条数
    fuzzyLevel = 'medium'  // 模糊程度：low(低), medium(中), high(高)
  } = req.query;

  // 验证必填参数
  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({
      success: false,
      error: '搜索关键词不能为空',
      message: '请提供keyword参数'
    });
  }

  // 参数验证和转换
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
  const offset = (pageNum - 1) * limitNum;
  const searchKeyword = keyword.trim();

  // 智能关键词处理
  const processedKeywords = processKeywordForFuzzySearch(searchKeyword, fuzzyLevel);

  // 构建WHERE条件
  let whereConditions = [];
  let queryParams = [];

  // 构建模糊搜索条件
  const searchConditions = buildFuzzySearchConditions(processedKeywords, fuzzyLevel);
  whereConditions.push(`(${searchConditions.condition})`);
  queryParams.push(...searchConditions.params);

  // 其他筛选条件
  if (country) {
    whereConditions.push('country = ?');
    queryParams.push(country);
  }

  if (status !== undefined && status !== '') {
    whereConditions.push('status = ?');
    queryParams.push(parseInt(status));
  }

  if (minLikes !== undefined && minLikes !== '') {
    whereConditions.push('like_count >= ?');
    queryParams.push(parseInt(minLikes));
  }

  if (maxLikes !== undefined && maxLikes !== '') {
    whereConditions.push('like_count <= ?');
    queryParams.push(parseInt(maxLikes));
  }

  const whereClause = 'WHERE ' + whereConditions.join(' AND ');

  // 构建智能排序（相关性 + 模糊匹配度）
  const relevanceScore = buildRelevanceScore(processedKeywords);
  
  const dataQuery = `
    SELECT 
      *,
      ${relevanceScore.scoreSQL} as relevance_score
    FROM anime_info 
    ${whereClause}
    ORDER BY relevance_score ASC, like_count DESC, id DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) as total FROM anime_info 
    ${whereClause}
  `;

  // 添加相关性评分参数
  const scoreParams = relevanceScore.params;
  const dataParams = [...scoreParams, ...queryParams, limitNum, offset];
  const countParams = [...queryParams];

  // 执行查询
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(dataQuery, dataParams, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(countQuery, countParams, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    })
  ])
  .then(([data, total]) => {
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    // 处理搜索结果，添加匹配信息
    const processedData = data.map(item => {
      const matchInfo = analyzeMatch(item.title, item.description, processedKeywords);
      return {
        ...item,
        match_info: matchInfo,
        highlighted_title: highlightMatches(item.title, processedKeywords.all),
        highlighted_description: highlightMatches(item.description || '', processedKeywords.all, 100)
      };
    });

    res.json({
      success: true,
      data: processedData,
      search_info: {
        original_keyword: searchKeyword,
        processed_keywords: processedKeywords,
        fuzzy_level: fuzzyLevel,
        total_found: total,
        search_time: new Date().toISOString()
      },
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_items: total,
        total_pages: totalPages,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
        next_page: hasNextPage ? pageNum + 1 : null,
        prev_page: hasPrevPage ? pageNum - 1 : null
      },
      filters: { country, status, min_likes: minLikes, max_likes: maxLikes },
      message: `模糊搜索"${searchKeyword}"找到${total}条结果`
    });
  })
  .catch(err => {
    console.error('模糊搜索查询错误:', err);
    res.status(500).json({ 
      success: false,
      error: '模糊搜索失败',
      message: err.message 
    });
  });
};

// 智能关键词处理函数
function processKeywordForFuzzySearch(keyword, fuzzyLevel) {
  // 基础清理
  const cleaned = keyword.replace(/[^\w\s\u4e00-\u9fff]/g, '').trim();
  
  // 分词处理（按空格和标点分割）
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  
  // 生成同义词和变体
  const synonyms = generateSynonyms(cleaned);
  const variants = generateVariants(cleaned, fuzzyLevel);
  
  return {
    original: keyword,
    cleaned: cleaned,
    words: words,
    synonyms: synonyms,
    variants: variants,
    all: [...words, ...synonyms, ...variants]
  };
}

// 构建模糊搜索条件
function buildFuzzySearchConditions(processedKeywords, fuzzyLevel) {
  const conditions = [];
  const params = [];
  
  // 原词精确匹配（最高优先级）
  if (processedKeywords.cleaned) {
    conditions.push('(title LIKE ? OR description LIKE ? OR tag LIKE ?)');
    const exactParam = `%${processedKeywords.cleaned}%`;
    params.push(exactParam, exactParam, exactParam);
  }
  
  // 分词匹配
  processedKeywords.words.forEach(word => {
    if (word.length >= 2) {
      conditions.push('(title LIKE ? OR description LIKE ? OR tag LIKE ?)');
      const wordParam = `%${word}%`;
      params.push(wordParam, wordParam, wordParam);
    }
  });
  
  // 同义词匹配（中等优先级）
  if (fuzzyLevel === 'medium' || fuzzyLevel === 'high') {
    processedKeywords.synonyms.forEach(synonym => {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const synonymParam = `%${synonym}%`;
      params.push(synonymParam, synonymParam);
    });
  }
  
  // 变体匹配（较低优先级，仅在高模糊度时使用）
  if (fuzzyLevel === 'high') {
    processedKeywords.variants.forEach(variant => {
      conditions.push('title LIKE ?');
      params.push(`%${variant}%`);
    });
  }
  
  return {
    condition: conditions.join(' OR '),
    params: params
  };
}

// 构建相关性评分
function buildRelevanceScore(processedKeywords) {
  let scoreSQL = `
    CASE 
      WHEN title = ? THEN 1
      WHEN title LIKE ? THEN 2
  `;
  let params = [processedKeywords.cleaned, `%${processedKeywords.cleaned}%`];
  
  // 为每个分词添加评分
  processedKeywords.words.forEach((word, index) => {
    scoreSQL += ` WHEN title LIKE ? THEN ${3 + index}`;
    params.push(`%${word}%`);
  });
  
  scoreSQL += ` ELSE 10 END`;
  
  return { scoreSQL, params };
}

// 生成同义词
function generateSynonyms(keyword) {
  const synonymMap = {
    '动漫': ['动画', '番剧', '动画片'],
    '动画': ['动漫', '番剧'],
    '番剧': ['动漫', '动画'],
    '电影': ['剧场版', '电影版'],
    '剧场版': ['电影', '电影版'],
    '进击': ['攻击', '进攻'],
    '巨人': ['泰坦', 'TITAN'],
    '鬼灭': ['鬼杀'],
    '火影': ['忍者'],
    '海贼': ['海盗'],
    '龙珠': ['七龙珠'],
    '死神': ['漂白剂', 'BLEACH']
  };
  
  const synonyms = [];
  for (const [key, values] of Object.entries(synonymMap)) {
    if (keyword.includes(key)) {
      synonyms.push(...values);
    }
  }
  
  return [...new Set(synonyms)];
}

// 生成变体（容错）
function generateVariants(keyword, fuzzyLevel) {
  const variants = [];
  
  if (fuzzyLevel === 'high' && keyword.length >= 3) {
    // 生成部分匹配变体
    for (let i = 0; i < keyword.length - 1; i++) {
      const variant = keyword.substring(i);
      if (variant.length >= 2) {
        variants.push(variant);
      }
    }
    
    // 生成前缀匹配
    for (let i = 2; i <= keyword.length; i++) {
      variants.push(keyword.substring(0, i));
    }
  }
  
  return [...new Set(variants)];
}

// 分析匹配信息
function analyzeMatch(title, description, processedKeywords) {
  const titleMatches = [];
  const descMatches = [];
  
  processedKeywords.all.forEach(keyword => {
    if (title && title.includes(keyword)) {
      titleMatches.push(keyword);
    }
    if (description && description.includes(keyword)) {
      descMatches.push(keyword);
    }
  });
  
  return {
    title_matches: titleMatches,
    description_matches: descMatches,
    match_count: titleMatches.length + descMatches.length
  };
}

// 高亮匹配内容
function highlightMatches(text, keywords, maxLength = 200) {
  if (!text) return '';
  
  let highlighted = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  
  // 截断过长的文本
  if (highlighted.length > maxLength) {
    highlighted = highlighted.substring(0, maxLength) + '...';
  }
  
  return highlighted;
}

export default router;


