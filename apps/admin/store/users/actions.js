export default {
  async GET_USERS ({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/users', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  REQUEST_FAILED ({ commit }, error) {
    commit('REQUEST_FAILED', error)
  },
  REQUEST_START ({ commit }) {
    commit('REQUEST_START')
  },
  REQUEST_END ({ commit }) {
    commit('REQUEST_END')
  }
}
