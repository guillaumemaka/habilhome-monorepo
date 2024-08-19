const Cookie = process.client ? require('js-cookie') : undefined

const getErrors = err => {
  if (!err) {
    return null
  }

  console.debug({ response: err.response })

  if (err.isAxiosError) {
    const { data } = err.response
    if (err.status === 422) {
      return { type: 'validations_error', errors: data.errors }
    } else {
      return { type: 'common_errors', message: data.message }
    }
  } else {
    return { type: 'common_errors', message: "Une erreur s'est produite." }
  }
}

export default {
  async LOGIN({ commit, dispatch }, { email, password }) {
    try {
      dispatch('SET_ERROR', false)
      dispatch('REQUEST_START')

      const { data } = await this.$axios.post('/auth/signin', {
        email,
        password
      })

      this.$axios.setToken(data.token, 'Bearer')

      Cookie.set('auth', JSON.stringify(data))

      commit('SET_AUTH', data)
      dispatch('REQUEST_END')
    } catch (err) {
      dispatch('REQUEST_END')
      dispatch('REQUEST_FAILED', err)
    }
  },
  LOGOUT({ commit }) {
    if (Cookie) {
      Cookie.remove('auth')
    }
    this.$axios.setToken()
    commit('SET_AUTH', null)
  },
  SET_AUTH({ commit }, data) {
    commit('SET_AUTH', data)
  },
  REQUEST_FAILED({ dispatch }, error) {
    dispatch('SET_ERROR', error)
  },
  REQUEST_START({ commit }) {
    commit('REQUEST_START')
  },
  REQUEST_END({ commit }) {
    commit('REQUEST_END')
  },
  SET_ERROR({ commit }, err) {
    commit('SET_ERROR', getErrors(err))
  }
}
