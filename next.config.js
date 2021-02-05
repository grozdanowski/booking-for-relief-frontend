module.exports = {
  serverRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    emitVolunteerAssignedHook: process.env.EMIT_VOLUNTEER_ASSIGNED_HOOK,
    emitVolunteerDoneHook: process.env.EMIT_VOLUNTEER_DONE_HOOK,
    frontendAppBackendToken: process.env.FRONTEND_APP_BACKEND_TOKEN,
  },
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    emitVolunteerAssignedHook: process.env.EMIT_VOLUNTEER_ASSIGNED_HOOK,
    emitVolunteerDoneHook: process.env.EMIT_VOLUNTEER_DONE_HOOK,
    frontendAppBackendToken: process.env.FRONTEND_APP_BACKEND_TOKEN,
  },
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