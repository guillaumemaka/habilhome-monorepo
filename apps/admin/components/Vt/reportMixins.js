import _ from 'lodash'
import Swal from 'sweetalert2'

export const baseMixin = {
  data() {
    return {
      title: 'Rapports',
      description: '',
      loaded: false,
      error: null
    }
  },
  computed: {
    succeed() {
      return this.report.status === 'PASSED'
    },
    statusLabel() {
      return this.succeed ? 'Réussi' : 'Échoué'
    }
  },
  head() {
    return {
      title: this.title,
      metaInfo: {
        meta: [
          {
            vmid: 'description',
            name: 'description',
            content: this.description
          }
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('SET_TITLE', this.title)
  },
  watch: {
    error: function(err) {
      if (err) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    },
    immediate: true
  }
}

export const asyncDataMixin = {
  async asyncData({ app, params, store }) {
    if (!params.id) {
      return {}
    }

    try {
      const { data } = await app.$axios.get(`/reports/${params.id}`)

      if (data.result && data.result.read === false) {
        store.dispatch('reports/MARK_AS_READ', { id: params.id, read: true })
      }

      const title = `Rapport > ${data.result.id}`

      return {
        original: _.cloneDeep(data.result),
        title,
        loaded: true,
        report: data.result,
        error: null
      }
    } catch (err) {
      if (err.response) {
        return { loaded: true, error: err.response.data, report: null }
      } else {
        return { loaded: true, error: err.message, report: null }
      }
    }
  }
}
