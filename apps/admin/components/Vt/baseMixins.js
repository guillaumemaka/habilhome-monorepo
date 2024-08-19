import _ from 'lodash'
import Swal from 'sweetalert2'

export const baseMixin = {
  data () {
    return {
      title: 'Applications > Ajouter une application',
      description: '',
      loaded: false,
      error: null,
      online: false,
      currentLang: 'fr'
    }
  },
  computed: {
    imageUrlIcon () {
      if (this.fields && this.fields.imageUrl && this.fields.imageUrl.valid) {
        return this.online ? 'cloud_done' : 'cloud_off'
      }

      return this.fields && this.fields.imageUrl && this.fields.imageUrl.valid ? 'check_circle' : 'cancel'
    },
    imageUrl () {
      if (this.application.imageUrl) {
        return this.application.imageUrl
      } else {
        return this.application.fr.imageUrl
      }
    },
    label () {
      return this.application.draft ? 'Brouillon' : 'Publiée'
    },
    current () {
      return this.application[this.currentLang]
    }
  },
  head () {
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
  methods: {
    setLang (lang) {
      this.currentLang = lang
    }
  },
  mounted () {
    this.$store.dispatch('SET_TITLE', this.title)
  },
  watch: {
    error: function (err) {
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
