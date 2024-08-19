import _ from 'lodash'
import Swal from 'sweetalert2'
import jsonFormData from 'json-form-data'

export const baseMixin = {
  data() {
    return {
      title: 'Thèmes > Ajouter un thème',
      description: '',
      loaded: false,
      error: null,
      currentLang: 'fr'
    }
  },
  computed: {
    label() {
      return this.theme.draft ? 'Brouillon' : 'Publiée'
    },
    current() {
      return this.theme[this.currentLang]
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
  methods: {
    setLang(lang) {
      this.currentLang = lang
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
  async asyncData({ app, params }) {
    if (!params.id) {
      return {}
    }

    try {
      const { data } = await app.$axios.get(`/themes/${params.id}`)

      const title = `Thèmes > ${data.result.name}`

      const { draft, icon } = data.result

      const fr = _.omit(data.result, 'translation', 'draft')

      const otherLanguages = data.result.translation.reduce((acc, t) => {
        acc[t.language] = t
        return acc
      }, {})

      return {
        title,
        loaded: true,
        theme: {
          icon,
          draft,
          fr,
          ...otherLanguages
        },
        error: null
      }
    } catch (err) {
      if (err.isAxiosError) {
        return { loaded: true, error: 'Une erreur est survenue!', theme: null }
      } else {
        return { loaded: true, error: err.message, theme: null }
      }
    }
  }
}

export const formMixin = {
  data() {
    return {
      appNameLabelStyle: {
        top: '-1.5rem'
      },
      appNameInputStyle: {
        fontSize: '42pt'
      },
      selectedFile: null,
      file: null,
      error: null
    }
  },
  props: {
    uploadProgress: {
      type: Number,
      default: null
    },
    edit: {
      type: Boolean,
      default: false
    },
    theme: {
      type: Object,
      default() {
        return {
          icon: null,
          draft: true,
          fr: { description: '', name: '', subThemes: [] },
          en: { description: '', name: '', subThemes: [] }
        }
      }
    }
  },
  computed: {
    current() {
      return this.theme[this.currentLang]
    }
  },
  mounted() {
    if (this.edit) {
      this.$validator.validateAll().catch(() => {})
    }
  },
  methods: {
    onSave() {
      this.$emit('on-save', {
        theme: this.theme,
        editing: this.edit,
        file: this.selectedFile
      })
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        this.file = e.target.result
        this.theme.icon = e.target.result
      }

      reader.readAsDataURL(this.selectedFile)
    }
  }
}

export const saveMixin = {
  data() {
    return {
      progressUpload: null
    }
  },
  methods: {
    async onSave({ file, theme, editing }) {
      const { fr, en, ...rest } = theme
      const payload = {
        ...rest,
        ...fr,
        language: 'fr',
        translation: [
          {
            ...en,
            language: 'en'
          }
        ]
      }

      let formData

      if (file) {
        delete payload.icon
        formData = new FormData()
        formData = jsonFormData(payload, {
          initialFormData: formData,
          showLeafArrayIndexes: true,
          includeNullValues: false
        })
        formData.append('icon', file)
      }

      try {
        const data = formData || payload
        const config = formData
          ? {
              // onUploadProgress: progressEvent => {
              //   this.uploadProgress = Math.round(
              //     (progressEvent.loaded * 100) / progressEvent.total
              //   )
              // }
            }
          : {}

        if (editing) {
          await this.$axios.put(
            `/themes/${this.$route.params.id}`,
            data,
            config
          )
        } else {
          await this.$axios.post('/themes', data, config)
        }

        if (file) {
          this.uploadProgress = null
        }

        const actionSuccessLabel = editing ? 'modifié' : 'ajouté'

        Swal.fire({
          type: 'success',
          title: `Thème ${actionSuccessLabel}`,
          html: `
            <p>Thèmes <strong>${
              payload.name
            }</strong> ${actionSuccessLabel} avec succès!</p>
          `,
          timer: 2000
        }).then(resutl => {
          this.$router.replace({
            name: 'themes'
          })
        })
      } catch (err) {
        if (file) {
          this.uploadProgress = null
        }

        let message = `Une erreur est survenue, veuillez réessayer plus tard.`

        if (err.response && err.response.data) {
          switch (err.response.data.message) {
            case 'already_exist':
            case 'duplicate': {
              message = `Thème ${payload.name} existe déjà.`
              break
            }
            default:
              break
          }
        }

        Swal.fire({
          type: 'error',
          title: 'Ooops',
          html: `
            <p>${message}</p>
          `,
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: 'Ok'
        })
      }
    }
  }
}
