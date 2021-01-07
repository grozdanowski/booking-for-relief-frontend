module.exports = {
  env: {
    customKey: 'my-value',
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://lit-coast-00350.herokuapp.com/admin',
        permanent: true,
      },
    ]
  },
}