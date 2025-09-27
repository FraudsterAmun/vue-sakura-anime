import axios from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = 'http://localhost:3000/'

const instance = axios.create({
  baseURL,
  timeout: 100000,
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      return res
    }
    ElMessage({ message: res.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({ message: err.response.data.message || '服务异常', type: 'error' })
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
