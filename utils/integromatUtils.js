export async function emitVolunteerAssigned(data) {

  const response = await fetch(`https://hook.integromat.com/cstg7grfhn82p97enudy6xiybrxuw8x9`, {
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

  const response = await fetch(`https://hook.integromat.com/ribyav1lly9nj6n6spd1pwt5escwd255`, {
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