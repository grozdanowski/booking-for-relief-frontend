const API_URL = 'https://potres2020.openit.hr/api/v3'

export async function fetchQuery(path, params = null) {
  let url
  if (params !== null) {
    url = `${API_URL}/${path}${params}`
  } else {
    url = `${API_URL}/${path}`
  }
  try {
    const response = await fetch(`${url}`)
    const text = await response.text()
    const data = JSON.parse(text)
    return data
  } catch {
    return null
  }
}