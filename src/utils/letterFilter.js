import { pinyin } from 'pinyin-pro'

/**
 * 使用 pinyin-pro 获取字符串的首字母
 * @param {string} str - 输入字符串
 * @returns {string} - 首字母大写
 */
export function getFirstLetter(str) {
  if (!str) return '#'

  const firstChar = str.charAt(0)

  // 如果是英文字母，直接返回大写
  if (/[A-Za-z]/.test(firstChar)) {
    return firstChar.toUpperCase()
  }

  // 如果是数字，返回 0-9
  if (/[0-9]/.test(firstChar)) {
    return '0-9'
  }

  // 使用 pinyin-pro 处理中文
  try {
    const pinyinResult = pinyin(firstChar, {
      pattern: 'first',
      toneType: 'none',
      type: 'array',
    })

    if (pinyinResult && pinyinResult[0]) {
      return pinyinResult[0].toUpperCase()
    }
  } catch (error) {
    console.warn('拼音转换失败:', error)
  }

  // 如果都不匹配，返回 #
  return '#'
}

/**
 * 获取所有可用的首字母列表
 * @returns {Array} - 首字母数组
 */
export function getLetterList() {
  return [
    '全部',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0-9',
    '#',
  ]
}

/**
 * 根据首字母筛选数据
 * @param {Array} data - 原始数据数组
 * @param {string} letter - 选择的首字母
 * @param {string} titleField - 标题字段名，默认为 'title'
 * @returns {Array} - 筛选后的数据
 */
export function filterByFirstLetter(data, letter, titleField = 'title') {
  if (!data || !Array.isArray(data)) return []
  if (letter === '全部') return data

  return data.filter((item) => {
    const title = item[titleField] || item.name || item.anime_name || ''
    const firstLetter = getFirstLetter(title)
    return firstLetter === letter
  })
}

/**
 * 为数据添加首字母字段（可选：预处理数据以提高性能）
 * @param {Array} data - 原始数据数组
 * @param {string} titleField - 标题字段名
 * @returns {Array} - 添加了首字母字段的数据
 */
export function addFirstLetterField(data, titleField = 'title') {
  if (!data || !Array.isArray(data)) return []

  return data.map((item) => ({
    ...item,
    firstLetter: getFirstLetter(item[titleField] || item.name || item.anime_name || ''),
  }))
}
