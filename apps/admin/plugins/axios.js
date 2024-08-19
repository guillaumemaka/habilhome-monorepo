export default function ({ $axios, app, store, redirect }) {
  $axios.onRequest(config => {
    if (store.state.auth.authenticated) {
      config.headers.common['Authorization'] = `Bearer ${store.state.auth.data.token}`
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      store.dispatch('auth/LOGOUT')
      redirect('/login')
    }
  })
}
