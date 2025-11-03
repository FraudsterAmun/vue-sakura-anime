k /**
 * 前端搜索工具函数
 * 用于在本地数据中进行搜索
 */

/**
 * 在动漫列表中搜索
 * @param {Array} animeList - 动漫列表数据
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 搜索结果
 */
export function searchAnimeList(animeList, keyword) {
  if (!keyword || !keyword.trim()) {
    return animeList
  }

  const searchKeyword = keyword.trim().toLowerCase()

  return animeList.filter((anime) => {
    // 搜索标题
    const title = (anime.title || '').toLowerCase()
    // 搜索副标题
    const subtitle = (anime.subtitle || '').toLowerCase()
    // 搜索别名
    const alias = (anime.alias || '').toLowerCase()
    // 搜索标签
    const tag = (anime.tag || '').toLowerCase()

    return (
      title.includes(searchKeyword) ||
      subtitle.includes(searchKeyword) ||
      alias.includes(searchKeyword) ||
      tag.includes(searchKeyword)
    )
  })
}

/**
 * 获取热门搜索关键词（从已有数据中提取）
 * @param {Array} animeList - 动漫列表
 * @returns {Array} 热门关键词列表
 */
export function getHotKeywords(animeList) {
  if (!animeList || animeList.length === 0) {
    return ['海贼王', '火影忍者', '鬼灭之刃', '进击的巨人', '咒术回战']
  }

  // 提取前10个动漫的标题作为热门搜索
  return animeList.slice(0, 10).map((anime) => anime.title)
}

/**
 * 获取搜索建议（基于标题匹配）
 * @param {Array} animeList - 动漫列表
 * @param {string} keyword - 输入的关键词
 * @returns {Array} 建议列表
 */
export function getSearchSuggestions(animeList, keyword) {
  if (!keyword || !keyword.trim() || !animeList || animeList.length === 0) {
    return []
  }

  const searchKeyword = keyword.trim().toLowerCase()
  const suggestions = []

  // 查找标题包含关键词的动漫
  for (const anime of animeList) {
    const title = (anime.title || '').toLowerCase()
    if (title.includes(searchKeyword)) {
      suggestions.push(anime.title)
    }

    // 最多返回8个建议
    if (suggestions.length >= 8) {
      break
    }
  }

  return suggestions
}

/**
 * 高亮搜索关键词
 * @param {string} text - 原文本
 * @param {string} keyword - 关键词
 * @returns {string} 高亮后的HTML字符串
 */
export function highlightKeyword(text, keyword) {
  if (!keyword || !text) return text

  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
