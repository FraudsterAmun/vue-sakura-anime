import request from '@/utils/request'
export const getAnimeType = (country) => {
  return request.get('/country/' + country)
}
