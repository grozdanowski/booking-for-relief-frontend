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

export async function isNumberActive(number) {
  if (!process.env.INFOBIP_API_KEY || !process.env.INFOBIP_API_BASE_URL) {
    console.log("Infobip API number check is not configured! Numbers will always be considered active!")
    return true;
  }

  const phoneNumberCheck = await doPhoneNumberLookup(number);
  if (phoneNumberCheck.results[0].status.groupName === 'DELIVERED') {
    return true;
  } else {
    return false;
  }
}