const baseUrl = process.env.BASE_URL || 'http://localhost:1337'


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


export async function addEntry(path, data) {
  const url = `${baseUrl}/${path}`

  fetch(`${url}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then( (response) => { 
    return response
  })
  .catch( (error) => {
    return error
  })
}

export async function markEntryAsFulfilled(path, id) {
  const url = `${baseUrl}/${path}/${id}`

  const data = {
    'fulfilled': true,
    'id': id,
  }

  fetch(`${url}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then( (response) => { 
    return response
  })
  .catch( (error) => {
    return error
  })
}