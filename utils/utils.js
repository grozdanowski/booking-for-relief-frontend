import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const baseUrl = publicRuntimeConfig.baseUrl || 'https://relief-app-backend.herokuapp.com'

export async function fetchQuery(path, params = null) {
  let url
  if (params !== null) {
    url = `${baseUrl}/${path}${params}`
  } else {
    url = `${baseUrl}/${path}`
  }
  const response = await fetch(`${url}`)
  const data = await response.json()
  return data
}

export async function authenticatedFetchQuery(path) {
  const response = await fetch(`${baseUrl}/${path}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `App ${publicRuntimeConfig.frontendAppBackendToken}`
    },
  })
  const data = await response.json()
  return data
}

export async function authenticatedPostQuery(path, data) {
  const url = `${baseUrl}/${path}`

  const response = await fetch(`${url}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `App ${publicRuntimeConfig.frontendAppBackendToken}`
      },
      body: JSON.stringify(data)
    })
    .catch( (error) => {
      return error
    })
  const payload = await response.json()
  return payload
}




export async function addEntry(path, data) {
  const url = `${baseUrl}/${path}`

  const response = await fetch(`${url}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .catch( (error) => {
      return error
    })
  const payload = await response.json()
  return payload
}