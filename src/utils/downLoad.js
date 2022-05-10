import { getToken } from '@/utils/auth'

import axios from 'axios'
export const downloadBlob = (fileName, url, info) => {
  const apiUrl = process.env.VUE_APP_BASE_API + url + info
  console.log(apiUrl, 'apiUrl')

  axios.get(apiUrl, { responseType: 'blob', headers: { token: getToken() }}).then((res) => {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    let num = ''
    for (let i = 0; i < 13; i++) {
      num += Math.ceil(Math.random() * 10)
    }
    if (res.data.type === 'image/jpeg') {
      link.setAttribute('download', fileName + num + '.JPG')
    } else {
      link.setAttribute('download', fileName + num + '.xlsx')
    }

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}
