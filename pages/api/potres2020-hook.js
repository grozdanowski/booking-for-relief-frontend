export default (req, res) => {
  console.log(req);
  res.statusCode = 200
  res.json({ content: 'Thanks!' })
}