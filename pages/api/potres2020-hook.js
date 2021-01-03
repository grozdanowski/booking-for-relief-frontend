export default (req, res) => {
  console.log(req.body);
  res.statusCode = 200
  res.json({ content: 'Thanks!' })
}