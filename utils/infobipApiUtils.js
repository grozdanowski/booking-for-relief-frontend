import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export async function doPhoneNumberLookup(number) {

  const data = {
    'to': [ number ]
  }

  const response = await fetch(`${publicRuntimeConfig.infobipApiBaseUrl}/number/1/query`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `App ${publicRuntimeConfig.infobipApiKey}`
      },
      body: JSON.stringify(data)
    })
    .catch( (error) => {
      return error
    })
  const payload = await response.json()
  return payload
}