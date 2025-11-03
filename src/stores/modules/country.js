import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAnimeType as fetchAnimeType } from '@/api/country'

export const useCountryStore = defineStore('country', () => {
  const type_info = ref({})
  const loading = ref(false)
  const currentType = ref('') // 当前正在加载的类型

  // 分别存储不同国家的数据（优化：避免重复请求）
  const japanAnimeList = ref([])
  const chinaAnimeList = ref([])

  // 获取动漫详情
  const getAnimeType = async (country) => {
    // 简单防重复：如果正在加载相同类型，直接返回
    if (loading.value && currentType.value === country) {
      console.log('🚫 跳过重复请求:', country)
      return
    }

    // 如果已经有缓存数据，直接使用（可选优化）
    if (country === 'japan' && japanAnimeList.value.length > 0) {
      console.log('📦 使用缓存数据:', country)
      type_info.value = { data: japanAnimeList.value }
      return
    }
    if (country === 'china' && chinaAnimeList.value.length > 0) {
      console.log('📦 使用缓存数据:', country)
      type_info.value = { data: chinaAnimeList.value }
      return
    }

    loading.value = true
    currentType.value = country

    try {
      console.log('🚀 开始获取数据:', country)
      const data = await fetchAnimeType(country)
      type_info.value = data.data.data

      // 缓存数据
      if (country === 'japan') {
        japanAnimeList.value = data.data.data.data || []
      } else if (country === 'china') {
        chinaAnimeList.value = data.data.data.data || []
      }

      console.log('✅ 数据获取成功:', country)
    } catch (error) {
      console.error('❌ 数据获取失败:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    getAnimeType,
    type_info,
    loading,
    // 暴露分类数据供搜索使用
    japanAnimeList,
    chinaAnimeList,
  }
})
