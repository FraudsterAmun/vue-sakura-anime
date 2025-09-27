// import axios from 'axios'
import request from '@/utils/request'
export const getBanner = () => {
  return request.get('/home/getAnimeBanners')
}

export const getJapanWeekAnime = (status) => {
  return request.get('/home/getAnimeJpUpdate', {
    params: {
      status,
    },
  })
}

export const getAnimeChinaUpdate = (status) => {
  return request.get('/home/getAnimeChinaUpdate', {
    params: {
      status,
    },
  })
}

export const getHotAnime = () => {
  return request.get('/home/getTopLikesByType')
}

export const getJapanAnimeRanking = () => {
  return request.get('/home/getJapanAnimeRanking')
}

export const getChinaAnimeRanking = () => {
  return request.get('/home/getChinaAnimeRanking')
}

export const getChinaRankingTitle = () => {
  return request.get('/home/getChinaAnimeTopTitles')
}

export const getJapanRankingTitle = () => {
  return request.get('/home/getJapanAnimeTopTitles')
}

export const getAnimeTopics = () => {
  return request.get('/home/getAnimeTopics')
}

export const getAnimeNews = () => {
  return request.get('/home/getAnimeNews')
}
