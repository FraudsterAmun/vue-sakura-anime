import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBanner,
  getJapanWeekAnime,
  getAnimeChinaUpdate,
  getHotAnime,
  getJapanAnimeRanking,
  getChinaAnimeRanking,
  getChinaRankingTitle,
  getJapanRankingTitle,
  getAnimeTopics,
  getAnimeNews,
} from '@/api/home'
export const useHomeStore = defineStore(
  'home',
  () => {
    const bannerList = ref([])
    const animeJapanWeekAnimeList = ref([])
    const hotAnimeList = ref([])
    const animeChinaUpdateList = ref([])
    const japanAnimeRankingList = ref([])
    const animeChinaRankingList = ref([])
    const chinaRankingTitleList = ref([])
    const japanRankingTitleList = ref([])
    const animeTopicsList = ref([])
    const animeNewsList = ref([])
    const getBannerList = async () => {
      const { data } = await getBanner()
      bannerList.value = data
    }
    const getJapanWeekAnimeList = async (status = 1) => {
      const {
        data: { japan },
      } = await getJapanWeekAnime(status)
      console.log(japan)

      animeJapanWeekAnimeList.value = japan
    }
    const getAnimeChinaUpdateList = async (status) => {
      const {
        data: { china },
      } = await getAnimeChinaUpdate(status)

      animeChinaUpdateList.value = china
    }
    const getHotAnimeList = async () => {
      const {
        data: { list },
      } = await getHotAnime()
      hotAnimeList.value = list
      console.log(hotAnimeList.value)
    }
    const getJapanRankingList = async () => {
      const { data } = await getJapanAnimeRanking()
      japanAnimeRankingList.value = data.data
    }
    const getChinaRankingList = async () => {
      const { data } = await getChinaAnimeRanking()

      animeChinaRankingList.value = data.data
    }
    const getChinaRankingTitleList = async () => {
      const { data } = await getChinaRankingTitle()
      chinaRankingTitleList.value = data.titles
    }
    const getJapanRankingTitleList = async () => {
      const { data } = await getJapanRankingTitle()
      japanRankingTitleList.value = data.titles
    }
    const getAnimeTopicsList = async () => {
      const { data } = await getAnimeTopics()
      animeTopicsList.value = data
    }

    const getAnimeNewsList = async () => {
      const { data } = await getAnimeNews()
      animeNewsList.value = data
    }
    return {
      bannerList,
      getBannerList,
      getJapanWeekAnimeList,
      animeJapanWeekAnimeList,
      getHotAnimeList,
      hotAnimeList,
      getAnimeChinaUpdateList,
      animeChinaUpdateList,
      getJapanRankingList,
      japanAnimeRankingList,
      getChinaRankingList,
      animeChinaRankingList,
      getChinaRankingTitleList,
      chinaRankingTitleList,
      getJapanRankingTitleList,
      japanRankingTitleList,
      getAnimeTopicsList,
      animeTopicsList,
      getAnimeNewsList,
      animeNewsList,
    }
  },
  {
    persist: true,
  },
)
