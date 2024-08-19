export default {
  async GET_APPLICATIONS ({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/applications', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async CREATE_APPLICATION ({ dispatch }, application) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.post('/applications', application)
      dispatch('REQUEST_END')
      dispatch('GET_APPLICATIONS')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async UPDATE_APPLICATION ({ dispatch }, application) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.put(`/applications/${application.id}`, application)
      dispatch('REQUEST_END')
      dispatch('GET_APPLICATIONS')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async DELETE_APPLICATION ({ dispatch }, application) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.delete(`/applications/${application.id}`)
      dispatch('REQUEST_END')
      dispatch('GET_APPLICATIONS')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  REQUEST_FAILED ({ commit }, error) {
    commit('REQUEST_FAILED', error)
  },
  REQUEST_START ({ commit }) {
    commit('REQUEST_START')
    commit('CLEAR_ERROR')
  },
  REQUEST_END ({ commit }) {
    commit('REQUEST_END')
  }
}
