// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  // res.statusCode = 200
  // res.json({ key: process.env.INFOBIP_API_KEY, body: req.body })
  console.log(req.body)
  try {
    const response = await fetch(`${process.env.INFOBIP_API_BASE_URL}/number/1/query`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `App ${process.env.INFOBIP_API_KEY}`
        },
        body: JSON.stringify(req.body)
      })
    const payload = await response.json()
    console.log(payload, `${process.env.INFOBIP_API_BASE_URL}/number/1/query`, `App ${process.env.INFOBIP_API_KEY}`)
    res.json(payload)
  } catch (error) {
    console.log(error)
    res.statusCode = 500
    res.json({ error: error })
  }
}