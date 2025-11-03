import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fuzzySearch } from '@/api/search'

export const useSearchStore = defineStore(
  'search',
  () => {
    // 当前搜索关键词
    const currentKeyword = ref('')
    // 搜索历史记录
    const searchHistory = ref([])
    // 搜索结果
    const searchResults = ref([])
    // 加载状态
    const loading = ref(false)
    // 错误信息
    const error = ref('')

    /**
     * 执行搜索（使用后端模糊搜索 API）
     * @param {string} keyword - 搜索关键词
     */
    const search = async (keyword) => {
      if (!keyword || !keyword.trim()) {
        searchResults.value = []
        currentKeyword.value = ''
        error.value = ''
        return
      }

      const trimmedKeyword = keyword.trim()
      currentKeyword.value = trimmedKeyword
      loading.value = true
      error.value = ''

      try {
        // 调用后端模糊搜索 API
        const response = await fuzzySearch(trimmedKeyword)

        // 根据后端返回的数据结构调整（可能需要根据实际返回调整）
        searchResults.value = response.data.data || response.data || []

        // 添加到搜索历史
        addToHistory(trimmedKeyword)
      } catch (err) {
        console.error('搜索失败:', err)
        error.value = '搜索失败，请稍后重试'
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }

    /**
     * 添加到搜索历史
     * @param {string} keyword - 搜索关键词
     */
    const addToHistory = (keyword) => {
      if (!keyword || !keyword.trim()) return

      const trimmedKeyword = keyword.trim()
      // 去重：移除已存在的相同关键词
      searchHistory.value = searchHistory.value.filter((item) => item !== trimmedKeyword)
      // 添加到开头
      searchHistory.value.unshift(trimmedKeyword)
      // 限制历史记录数量（最多10条）
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
    }

    /**
     * 清空搜索历史
     */
    const clearHistory = () => {
      searchHistory.value = []
    }

    /**
     * 删除单条历史记录
     * @param {string} keyword - 要删除的关键词
     */
    const removeHistoryItem = (keyword) => {
      searchHistory.value = searchHistory.value.filter((item) => item !== keyword)
    }

    /**
     * 清空搜索结果
     */
    const clearResults = () => {
      searchResults.value = []
      currentKeyword.value = ''
    }

    return {
      // 状态
      currentKeyword,
      searchHistory,
      searchResults,
      loading,
      error,
      // 方法
      search,
      addToHistory,
      clearHistory,
      removeHistoryItem,
      clearResults,
    }
  },
  {
    persist: {
      // 只持久化搜索历史
      paths: ['searchHistory'],
    },
  },
)
