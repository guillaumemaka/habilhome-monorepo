export default {
  REQUEST_END (state) {
    state.loading = false
  },
  REQUEST_START (state) {
    state.loading = true
    state.error = null
  },
  SET_DATA (state, data) {
    state.data = data
  },
  REQUEST_FAILED (state, err) {
    state.error = err
  }
}
