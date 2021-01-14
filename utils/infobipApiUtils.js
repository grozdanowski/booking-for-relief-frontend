export async function doPhoneNumberLookup(number) {

  const data = {
    "to": [ number ]
  }

  const response = await fetch(`/api/check-number`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .catch( (error) => {
      return error
    })
  const payload = await response.json()
  return payload
}