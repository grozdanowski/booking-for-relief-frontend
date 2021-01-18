// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
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
    res.json(payload)
  } catch (error) {
    res.statusCode = 500
    res.json({ error: error })
  }
}