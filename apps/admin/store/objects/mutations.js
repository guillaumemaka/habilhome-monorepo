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
  DELETE_OBJECT (state, object) {
    state.data = state.data.map(o => {
      if (o._id === object._id) {
        return object
      }
      return o
    })
  },
  REQUEST_FAILED (state, err) {
    state.error = err
  }
}
