import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAnimeDetail as fetchAnimeDetail } from '@/api/detail'

export const useDetailStore = defineStore('detail', () => {
  const detail_info = ref({})
  // 获取动漫详情
  const getAnimeDetail = async (id) => {
    const data = await fetchAnimeDetail(id)
    detail_info.value = data.data.data
  }

  return {
    getAnimeDetail,
    detail_info,
  }
})
