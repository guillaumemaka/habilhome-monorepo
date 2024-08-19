const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    stats: [],
    loadingStats: false,
    loadingStatsError: null,
    appName: 'VIGIE-TECH',
    title: '',
    navigations: [
      {
        path: '/',
        name: 'Dashboard',
        icon: 'dashboard',
        exact: true,
        role: 'user'
      },
      {
        path: '/applications',
        name: 'Applications',
        icon: 'apps',
        role: 'user'
      },
      {
        path: '/objects',
        name: 'Objets Connectés',
        icon: 'settings_remote',
        role: 'user'
      },
      { path: '/themes', name: 'Thèmes', icon: 'label', role: 'user' }, // {
      //   path: '/surveys',
      //   name: 'Questionnaires',
      //   icon: 'assignment_turned_in',
      //   role: 'user'
      // },
      { path: '/users', name: 'Utilisateurs', icon: 'group', role: 'admin' },
      {
        path: '/reports',
        name: 'Reports',
        icon: 'assignment_turned_in',
        role: 'admin'
      },
      {
        path: '/settings',
        name: 'Configuration',
        icon: 'settings',
        role: 'admin'
      }
    ]
  }
}

export const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  SET_STATS(state, stats) {
    state.stats = Object.keys(stats).map(key => {
      return {
        name: key,
        stats: stats[key]
      }
    })
  },
  SET_STATS_REQUEST(state) {
    state.loadingStats = true
    state.loadingStatsError = null
  },
  SET_STATS_SUCCESS(state) {
    state.loadingStats = false
  },
  SET_STATS_FAIL(state, err) {
    state.loadingStats = false
    state.loadingStatsError = err
  }
}

export const actions = {
  SET_TITLE({ commit }, title) {
    commit('setTitle', title)
  },
  async GET_STATS({ commit }) {
    try {
      commit('SET_STATS_REQUEST')
      const { data } = await this.$axios.get('/stats')
      commit('SET_STATS_SUCCESS')
      commit('SET_STATS', data.stats)
    } catch (err) {
      commit('SET_STATS_FAIL', err)
    }
  },
  async nuxtServerInit({ app, commit, dispatch }, { req }) {
    let auth = null
    if (req && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)

      try {
        auth = JSON.parse(parsed.auth)
        if (auth && auth.token) {
          app.$axios.setToken(auth.token, 'Bearer')
        }
      } catch (err) {
        // No valid cookie found
      }
    }

    commit('auth/SET_AUTH', auth)
    // await dispatch('themes/GET_THEMES', {})
  }
}
