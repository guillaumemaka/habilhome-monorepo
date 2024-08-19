export default function ({ store, app, isClient }) {
  // If the user is not authenticated
  if (isClient && store.state.auth.authenticated) {
    app.$axios.setToken(store.state.auth.token, 'Bearer')
  }
}
