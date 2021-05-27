import axios from 'axios'
import Cookies from 'js-cookie'
import { message, notification } from 'ant-design-vue'
import { router } from '@/router'

axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://localhost:8080/api'

const PREFIX = 'Bearer '

axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['Authorization'] = PREFIX + token
    }
    return config
  },
  (error) => {
    notification.error({
      message: error.message,
      description: '操作成功',
    })
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    let headers = response.headers
    if (headers && headers.authorization) {
      const token = response.headers.authorization
      Cookies.set('token', token)
    }
    const { code, msg } = response.data
    if (code === 20000) {
      return Promise.resolve(response.data)
    }
    if (code === 40001) {
      message.error(msg)
      Cookies.remove('token')
      router.push('/login')
      return Promise.reject(response.data)
    }

    if (code === 40002) {
      message.error(msg)
      return Promise.reject(response.data)
    }
    if (code == 40003) {
      notification.error({
        message: msg,
        duration: null,
        description: '请联系管理员',
      })
      return Promise.reject(response.data)
    }

    if (code > 40100) {
      notification.error({
        message: msg,
      })
      return Promise.reject(response.data)
    }
    if (code >= 40000) {
      notification.error({
        message: msg,
      })
      return Promise.reject(response.data)
    }
  },
  (error) => {
    notification.error({
      message: error.message,
      description: '请联系管理员1',
    })
    return Promise.reject(error)
  }
)

export default axios
