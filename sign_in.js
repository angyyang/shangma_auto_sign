import axios from 'axios'
import { getHeaders } from './lib/http_util.js'
import getCookie from './cookies.js'

async function signIn() {
  const cookies = await getCookie()
  console.log(cookies)

  const tokenEntry = cookies.find(entry => entry['SHM_JWT_TOKEN'] !== undefined)
  if (tokenEntry === undefined) {
    throw Error('cannot get authorization')
  }
  let headers = getHeaders()

  let login_config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://apih5.shang-ma.com/app/web/user/login',
    headers: headers,
    data: '{"encryptedData":"C9uObdHuFgfJgiKCtOfUcc6+d6BVaM7t5lmglQwBxOyOxihnV0va2saqBreCObrSWe4W/NrsCbnfTZAddMi3faDGQm78zZYcODz4tTOe6GEQj2kH/n8oz1NtHjxAf1hw","encryptedKey":"gstcEr1PDrX3tqo+lhN0Mt+EYtdk577aajcHDNwyuDKs/PhFLFj46LwQ/hijy8IjkxkiKN8QDizhKCJ2CxEzmswNHsQZ9PcAyCJbpj2T+wpMyPjkEyiB7WNubWRYbo1nd/A+MFWAIRfrHy0VXN6z9wLj6lfZ4yB4Sl29kR7NiB8="}'
  }
  const login_response = await axios.request(login_config)
  //console.log(login_response)
  let login_token = login_response.data.data.token

  headers.authorization = 'JwtUser '.concat(tokenEntry['SHM_JWT_TOKEN'])
  headers = Object.assign({}, headers, {'Shm-Token': login_token, 'Token': login_token})

  console.log(headers);
  let new_data = JSON.stringify({"encryptedData":"9llgMgEjl7Rb0a6nPCebKA==","encryptedKey":"b/rvbId0LpbRoQbQeiXklOXN1lo4hQHoOcU2gC/PKMzU8Hlb4iXjAbrZ4XVMDWd8aXK5Yd1d0V+hn4z8P9M0/+XXvdDtn4aWv/6rHmr8IYJSMbhL8c0JcCDzNgz94lKBYmlNYVHfjPLR7lMmY6tAQf1Uj5rvZvNdlnfpjpHsBF4="})
  let data = JSON.stringify({
    //请求参数为：{}，经过AES算法加密之后就是: S1uAYaf/g6oBpv8DWUaQlQ==，在前端js代码中搜索encryptBody关键字
    encryptBody: 'S1uAYaf/g6oBpv8DWUaQlQ=='
  })

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.shang-ma.com/api/v1/user/integral/sign-in',
    headers: headers,
    data: data
  }

  let new_config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://apih5.shang-ma.com/app/web/user/checkin/1095885',
    headers: headers,
    data: new_data
  }

  const response = await axios.request(config)
  console.log(JSON.stringify(response.data))
  if (response.status !== 200) {
    throw Error('sign in return http status error:' + response.status)
  }
  if (response.data.code !== 0 && response.data.code !== 5001) {
    throw Error('sign in code error:' + response.data.code)
  }

  const new_response = await axios.request(new_config)
  console.log(JSON.stringify(new_response.data))
  if (new_response.status !== 200) {
    throw Error('sign in return http status error:' + response.status)
  }
  if (new_response.data.code !== 0 && new_response.data.code !== 5001) {
    throw Error('sign in code error:' + response.data.code)
  }


  
}

export default signIn
