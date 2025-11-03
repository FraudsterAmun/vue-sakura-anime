import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// 获取动漫专题数据的路由
export const getAnimeBanners = (req, res) => {
    const query = 'SELECT * FROM anime_banners'; // 假设表名为 anime_topics
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('数据库查询失败');
        }
        res.json(results); // 返回查询结果
    });
};

export const getAnimeJpUpdate = (req, res) => {
  const { status } = req.query;
  const statusNum = parseInt(status, 10);
  
  // 验证参数
  if (isNaN(statusNum) || statusNum < 1 || statusNum > 7) {
    return res.status(400).json({ 
      error: 'status参数必须是1-7之间的数字（代表星期几）' 
    });
  }

  // SQL查询：仅按点赞人数排序，取前5
  const query = `
    -- 日本动漫：点赞人数最高TOP5
    (SELECT *, 'japan' AS anime_type FROM anime_info 
     WHERE country = 'japan' AND status = ? 
     ORDER BY like_count DESC  -- 按点赞人数降序
     LIMIT 25)
  `;

  // 执行查询（2个子查询，对应2个status参数）
  db.query(query, [statusNum, statusNum], (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 整理结果：按地区分组
    const japanTopLikes = results.filter(item => item.anime_type === 'japan');
    
    res.json({
      japan: japanTopLikes,  // 日本动漫：点赞最高TOP5
    });
  });
};

export const getAnimeChinaUpdate = (req, res) => {
  const { status } = req.query;
  const statusNum = parseInt(status, 10);
  
  // 验证参数
  if (isNaN(statusNum) || statusNum < 1 || statusNum > 7) {
    return res.status(400).json({ 
      error: 'status参数必须是1-7之间的数字（代表星期几）' 
    });
  }

  // SQL查询：仅按点赞人数排序，取前5
  const query = `
    -- 日本动漫：点赞人数最高TOP5
    (SELECT *, 'china' AS anime_type FROM anime_info 
     WHERE country = 'china' AND status = ? 
     ORDER BY like_count DESC  -- 按点赞人数降序
     LIMIT 25)
  `;

  // 执行查询（2个子查询，对应2个status参数）
  db.query(query, [statusNum, statusNum], (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 整理结果：按地区分组
    const chinaTopLikes = results.filter(item => item.anime_type === 'china');
    
    res.json({
      china: chinaTopLikes,  // 日本动漫：点赞最高TOP5
    });
  });
};

// 不限制status，获取日漫和中漫的点赞最高TOP5（各5条）
export const getTopLikesByType = (req, res) => {
  // SQL查询：不筛选status，仅按type和点赞数排序
  const query = `
    -- 日本动漫：点赞最高TOP5（忽略status）
    (SELECT *, 'japan' AS anime_type FROM anime_info 
     WHERE country = 'japan' 
     ORDER BY like_count DESC 
     LIMIT 6)
    UNION ALL
    -- 中国动漫：点赞最高TOP5（忽略status）
    (SELECT *, 'china' AS anime_type FROM anime_info 
     WHERE country = 'china' 
     ORDER BY like_count DESC 
     LIMIT 6)
  `;

  // 执行查询（无需status参数）
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 整理结果：按地区分组
    const japanTopLikes = results.filter(item => item.anime_type === 'japan');
    const chinaTopLikes = results.filter(item => item.anime_type === 'china');
    const allTopLikes = [...japanTopLikes, ...chinaTopLikes];
    res.json({
      list: allTopLikes,  // 日本动漫：全status中点赞最高TOP5
    });
  });
};

// 获取type是japan且status不等于0的五条数据
export const getJapanAnimeRanking = (req, res) => {
  // SQL查询：筛选type='japan'且status!=0的数据，按点赞数排序取前5条
  const query = `
    SELECT * FROM anime_info 
    WHERE country = 'japan' AND status != 0 
    ORDER BY like_count DESC 
    LIMIT 6
  `;

  // 执行查询
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    res.json({
      data: results,
      count: results.length,
      message: 'type为japan且status不等于0的前5条数据'
    });
  });
};

// 获取type是japan且status不等于0的五条数据
export const getChinaAnimeRanking = (req, res) => {
  // SQL查询：筛选type='japan'且status!=0的数据，按点赞数排序取前5条
  const query = `
    SELECT * FROM anime_info 
    WHERE country = 'china' AND status != 0 
    ORDER BY like_count DESC 
    LIMIT 6
  `;

  // 执行查询
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    res.json({
      data: results,
      count: results.length,
      message: 'type为china且status不等于0的前5条数据'
    });
  });
};

// 获取8条点赞人数最高的日本动漫的title
export const getJapanAnimeTopTitles = (req, res) => {
  // SQL查询：筛选type='japan'的数据，按点赞数排序取前8条，只返回title字段
  const query = `
    SELECT id,title FROM anime_info 
    WHERE country = 'japan' 
    ORDER BY like_count DESC 
    LIMIT 8
  `;

  // 执行查询
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 提取title数组
    const titles = results.map(item => item.title);

    res.json({
      titles: titles,
      count: titles.length,
      message: '点赞人数最高的8条日本动漫标题'
    });
  });
};

// 获取8条点赞人数最高的日本动漫的title
export const getChinaAnimeTopTitles = (req, res) => {
  // SQL查询：筛选type='japan'的数据，按点赞数排序取前8条，只返回title字段
  const query = `
    SELECT id,title FROM anime_info 
    WHERE country = 'china' 
    ORDER BY like_count DESC 
    LIMIT 8
  `;

  // 执行查询
  db.query(query, (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 提取title数组
    const titles = results.map(item => item.title);

    res.json({
      titles: titles,
      count: titles.length,
      message: '点赞人数最高的8条中国动漫标题'
    });
  });
};

// 获取动漫专题数据的路由
export const getAnimeTopics = (req, res) => {
    const query = 'SELECT * FROM anime_topics'; // 假设表名为 anime_topics
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('数据库查询失败');
        }
        res.json(results); // 返回查询结果
    });
};

// 获取动漫新闻数据的路由
export const getAnimeNews = (req, res) => {
    const query = 'SELECT * FROM anime_news'; // 假设表名为 anime_topics
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('数据库查询失败');
        }
        res.json(results); // 返回查询结果
    });
};

export default router;