module.exports = {
  env: {
    customKey: 'my-value',
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://relief-app-backend.herokuapp.com/admin',
        permanent: true,
      },
    ]
  },
}