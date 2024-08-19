export default {
  REQUEST_END(state) {
    state.loading = false
  },
  REQUEST_START(state) {
    state.loading = true
  },
  SET_AUTH(state, data) {
    const { token, email, ...rest } = data || {}
    state.data = data
    state.authenticated = !!token
    state.email = email || null
    state.userInfo = rest
  },
  SET_ERROR(state, err) {
    state.error = err
  }
}
