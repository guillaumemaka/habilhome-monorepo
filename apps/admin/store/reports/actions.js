export default {
  async GET_REPORTS({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/reports', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async MARK_AS_READ({ dispatch }, { id, read }) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.put(`/reports/${id}`, { read })
      dispatch('REQUEST_END')
      dispatch('GET_REPORTS')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  REQUEST_FAILED({ commit }, error) {
    commit('REQUEST_FAILED', error)
  },
  REQUEST_START({ commit }) {
    commit('REQUEST_START')
    commit('CLEAR_ERROR')
  },
  REQUEST_END({ commit }) {
    commit('REQUEST_END')
  }
}
