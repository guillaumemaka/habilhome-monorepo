export default {
  async GET_THEMES ({ commit, dispatch }, payload = {}) {
    try {
      dispatch('REQUEST_START')
      const { data } = await this.$axios.get('/themes', { params: payload })
      dispatch('REQUEST_END')
      commit('SET_DATA', data)
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async CREATE_THEME ({ dispatch }, theme) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.post('/themes', theme)
      dispatch('REQUEST_END')
      dispatch('GET_THEMES')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async UPDATE_THEME ({ dispatch }, theme) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.put(`/themes/${theme.id}`, theme)
      dispatch('REQUEST_END')
      dispatch('GET_APPLICATIONS')
    } catch (err) {
      dispatch('REQUEST_FAILED', err)
    }
  },
  async DELETE_THEME ({ dispatch }, theme) {
    try {
      dispatch('REQUEST_START')
      await this.$axios.delete(`/themes/${theme.id}`)
      dispatch('REQUEST_END')
      dispatch('GET_THEMES')
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
