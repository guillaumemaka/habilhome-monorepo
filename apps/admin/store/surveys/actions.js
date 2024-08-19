export default {
  async GET_SURVEYS ({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/surveys', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async DELETE_SURVEY ({ commit, dispatch }, surveyId) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.delete(`/surveys/${surveyId}`)
      dispatch('REQUEST_END')
      commit('DELETE_SURVEY', data.result)
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
