const baseUrl = process.env.BASE_URL || 'https://lit-coast-00350.herokuapp.com'

export async function findEntry(path, originalAppId) {
  const url = `${baseUrl}/${path}?original_app_id=${originalAppId}`
  const response = await fetch(`${url}`)
  const data = await response.json()
  return data
}

export async function patchEntry(path, id) {
  const url = `${baseUrl}/${path}/${id}`

  const data = {
    'fulfilled': true,
    'id': id,
  }

  const response = await fetch(`${url}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const responseData = await response.json()
  return responseData
}

export default (req, res) => {
  console.log(req.body);
  const item = req.body;
  if (item.status === 'archived') {
    let endpoint;
    const formId = item.form ? item.form.id : item.form_id;
    switch (formId) {
      case 5:
        endpoint = 'accommodations'
        break;
      case 13:
        endpoint = 'aid-collections'
        break;
      default:
        endpoint = 'aid-requests'
        break;
    }
    findEntry(endpoint, item.id)
      .then((data) => {
        if (data.length) {
          patchEntry(endpoint, data[0].id)
          .then((response) => {
            res.statusCode = 200
            res.json({ content: 'Marked as done!' })
          })
          .catch((error) => {
            console.log('Error in Potres2020 webhook:', error)
            res.statusCode = 500
            res.json({ content: 'Error' })
          })
        }
      })
      .catch((error) => {
        res.statusCode = 404
        console.log('Did not find the entry:', error)
        res.json({ content: 'Did not find the entry.' })
      })
  } else {
    console.log('Item changed, but status not archived.')
    res.statusCode = 200
    res.json({ content: 'Item changed, but status not archived.' })
  }
}