import request from '@/utils/request'

export const getAnimeDetail = (id) => {
  return request.get('/detail/' + id)
}
