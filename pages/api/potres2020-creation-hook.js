const baseUrl = process.env.BASE_URL || 'https://lit-coast-00350.herokuapp.com'

const findLatLonData = (values, requestedValue) => {
  let value = null;
  Object.keys(values).forEach((key) => {
    if ((Array.isArray(values[key])) && (values[key][0][requestedValue])) {
      value = values[key][0][requestedValue];
    }
  })
  return value;
}

export async function addEntry(path, data) {
  const url = `${baseUrl}/${path}`
  
  console.log('Saljem novi zapis iz potres2020 na:', url);

  const response = await fetch(`${url}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .catch( (error) => {
      console.log('There was an error in the addEntry function!');
      return error
    })
  const payload = await response.json()
  return payload
}

export default (req, res) => {
  console.log('Creation event triggered!');
  console.log(req.body);
  const item = req.body;
  const newData = {
    'locationLat': findLatLonData(item.values, 'lat'),
    'locationLon': findLatLonData(item.values, 'lon'),
    'location': item.title,
    'description': item.content,
    'notes': `URL na izvorni item na Potres2020: https://potres2020.openit.hr/posts/${item.id}     Dodatni info iz Potres2020: ${item.values['3c8441b3-5744-48bb-9d9e-d6ec4be50613']}`,
    'contact_name': item.values['4583d2a1-331a-4da2-86df-3391e152198e'] ? item.values['4583d2a1-331a-4da2-86df-3391e152198e'][0] : '',
    'contact_phone': item.values['1328cf24-09de-44cd-b159-6242e6165530'] ? item.values['1328cf24-09de-44cd-b159-6242e6165530'][0] : '',
    'submitter_email': 'potres@2020.hr',
    'available_on_whatsapp': false,
    'original_app_id': item.id,
  }
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
  console.log(newData);
  addEntry(endpoint, newData)
    .then((response) => {
      console.log('Backend API response:', response)
      res.statusCode = 200
    })
    .catch((error) => console.log('Error in Potres2020 webhook:', error))
  res.json({ content: 'Thanks!' })
}