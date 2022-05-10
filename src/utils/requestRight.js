import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

function baseURLEnv() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://operation-server.ciecdev.com/'
  } else if (window.location.hostname.indexOf('test') !== -1) {
    return 'http://operation-server.ciecdev.com/'
  } else {
    return 'http://operation-server.ciecdev.com/'
  }
}

// create an axios instance
const service = axios.create({
  baseURL: baseURLEnv(), // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Token'] = getToken() || ''
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res, typeof res)
    if (res instanceof Blob) {
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 1001: token失效;
      if (res.code === 1001) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service