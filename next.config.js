module.exports = {
  serverRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    emitVolunteerAssignedHook: process.env.EMIT_VOLUNTEER_ASSIGNED_HOOK,
    emitVolunteerDoneHook: process.env.EMIT_VOLUNTEER_DONE_HOOK,
  },
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    emitVolunteerAssignedHook: process.env.EMIT_VOLUNTEER_ASSIGNED_HOOK,
    emitVolunteerDoneHook: process.env.EMIT_VOLUNTEER_DONE_HOOK,
    infobipApiBaseUrl: process.env.INFOBIP_API_BASE_URL,
    infobipApiKey: process.env.INFOBIP_API_KEY,
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