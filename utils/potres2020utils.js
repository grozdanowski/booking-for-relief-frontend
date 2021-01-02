const API_URL = 'https://potres2020.openit.hr/api/v3'

export async function fetchQuery(path, params = null) {
  let url
  if (params !== null) {
    url = `${API_URL}/${path}${params}`
  } else {
    url = `${API_URL}/${path}`
  }
  const response = await fetch(`${url}`)
  const data = await response.json()
  return data
}