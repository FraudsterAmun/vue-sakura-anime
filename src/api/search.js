import request from '@/utils/request'

/**
 * 模糊搜索动漫
 * @param {string} keyword - 搜索关键词
 * @returns {Promise}
 */
export const fuzzySearch = (keyword) => {
  return request.get('/home/fuzzySearch', {
    params: {
      keyword,
    },
  })
}
