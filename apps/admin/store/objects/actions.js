export default {
  async GET_OBJECTS ({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/objects', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async DELETE_OBJECT ({ commit, dispatch }, objectId) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.delete(`/objects/${objectId}`)
      dispatch('REQUEST_END')
      commit('DELETE_OBJECT', data.result)
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
