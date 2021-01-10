import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export async function emitVolunteerAssigned(data) {

  const response = await fetch(publicRuntimeConfig.emitVolunteerAssignedHook, {
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
  const payload = await response
  return payload
}

export async function emitVolunteerMarkedTaskDone(data) {

  const response = await fetch(publicRuntimeConfig.emitVolunteerDoneHook, {
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
  const payload = await response
  return payload
}