// environment.prod.ts — used during PRODUCTION BUILD (ng build)
//
// When you run "ng build", Angular uses THIS file instead.
// Replace the apiUrl value with your deployed backend URL (e.g. on Render).
//
// Example after deploying to Render:
//   apiUrl: 'https://mtn-connect-api.onrender.com/api'

export const environment = {
  production: true,
  apiUrl: 'https://mtnconnect.onrender.com/api',
};
