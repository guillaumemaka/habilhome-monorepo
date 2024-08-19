import _ from 'lodash'
import Swal from 'sweetalert2'
import { differenceObject } from '../../lib/utils'

export const baseMixin = {
  data() {
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
    price() {
      const inapp = this.application.price.inAppPurchased
        ? '(Contient des achat intégrés.)'
        : ''
      const currency =
        this.application.price.currency ||
        '(Aucune devise spécifiée. Le Dollars Canadadien (CAD) sera utilisé par défaut) - CAD'

      if (this.application.price.free) {
        return `Gratuit ${inapp}`
      }

      if (this.application.price.fixedPrice) {
        return `${currency} ${this.application.price.low}  ${inapp}`
      }

      if (this.application.price.variable) {
        if (!this.application.price.low || !this.application.price.high) {
          return `Variable  ${inapp}`
        }

        return `Entre ${currency} ${
          this.application.price.low
        } et ${currency} ${this.application.price.high}  ${inapp}`
      }

      return ''
    },
    imageUrlIcon() {
      if (this.fields && this.fields.imageUrl && this.fields.imageUrl.valid) {
        return this.online ? 'cloud_done' : 'cloud_off'
      }

      return this.fields && this.fields.imageUrl && this.fields.imageUrl.valid
        ? 'check_circle'
        : 'cancel'
    },
    imageUrl() {
      if (this.application.imageUrl) {
        return this.application.imageUrl
      } else {
        return this.application.fr.imageUrl
      }
    },
    lang: {
      get() {
        return this.application.lang
      },
      set(v) {
        this.application.lang = v
      }
    },
    favorite() {
      return this.application.favorite
    },
    draft() {
      return this.application.draft
    },
    label() {
      return this.application.draft ? 'Brouillon' : 'Publiée'
    },
    current() {
      return this.application[this.currentLang]
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
    async checkLink(url) {
      try {
        const response = await this.$axios.head(url, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        this.online = response.status === 200
      } catch (err) {
        this.online = false
      }
    },
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
      const { data } = await app.$axios.get(`/applications/${params.id}`)

      const title = `Applications > ${data.result.name}`
      const description = data.result.description

      const {
        deletedAt,
        imageUrl,
        os,
        price,
        draft,
        favorite,
        lang,
        customizableLang
      } = data.result

      const fr = _.omit(data.result, ['translation', 'price', 'lang'])
      const otherLanguages = data.result.translation.reduce((acc, t) => {
        acc[t.language] = _.omit(
          {
            name: '',
            companyName: '',
            imageUrl: '',
            links: [],
            description: '',
            comment: '',
            theme: '',
            subThemes: [],
            deviceRestritions: '',
            requiredAbilities: '',
            language: '',
            ...t
          },
          ['price', 'lang']
        )
        return acc
      }, {})

      return {
        original: _.cloneDeep(data.result),
        title,
        description,
        loaded: true,
        application: {
          deletedAt,
          customizableLang,
          imageUrl,
          os,
          price,
          draft,
          favorite,
          lang,
          translated: false,
          fr,
          ...otherLanguages
        },
        error: null
      }
    } catch (err) {
      if (err.request) {
        return { loaded: true, error: err.data.message, application: null }
      } else {
        return { loaded: true, error: err.message, application: null }
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
      imageUrlValid: false
    }
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    application: {
      type: Object,
      default() {
        return {
          os: '',
          price: {
            low: null,
            high: null,
            fixedPrice: false,
            free: false,
            currency: '',
            variable: false,
            inAppPurchased: false
          },
          customizableLang: false,
          imageUrl: '',
          draft: true,
          favorite: false,
          lang: [],
          translated: false,
          fr: {
            name: '',
            companyName: '',
            imageUrl: '',
            links: [],
            description: '',
            comment: '',
            themes: [],
            subThemes: [],
            deviceRestritions: '',
            requiredAbilities: '',
            language: 'fr'
          },
          en: {
            name: '',
            companyName: '',
            imageUrl: '',
            links: [],
            description: '',
            comment: '',
            themes: [],
            subThemes: [],
            deviceRestritions: '',
            requiredAbilities: '',
            language: 'en'
          }
        }
      }
    }
  },
  computed: {
    current() {
      return this.application[this.currentLang]
    }
  },
  async mounted() {
    if (this.$validateAll) {
      this.$validateAll().catch(() => {})
    }

    if (this.imageUrl) {
      await this.checkLink(this.imageUrl)
    }
  },
  methods: {
    onSave() {
      this.$emit('on-save', {
        application: this.application,
        editing: this.edit
      })
    },
    onRestore() {
      this.$emit('on-restore', {
        application: this.application,
        editing: this.edit
      })
    },
    addLink() {
      if (!this.application[this.currentLang].links) {
        this.application[this.currentLang].links = []
      }
      this.application[this.currentLang].links = [
        ...this.current.links,
        { title: '', url: '' }
      ]
    },
    deleteLink(index) {
      if (index > this.application[this.currentLang].length) {
        return
      }

      this.application[this.currentLang].links.splice(index, 1)
    }
  },
  watch: {
    'current.imageUrl': async function(newVal) {
      if (this.fields && this.fields.imageUrl && this.fields.imageUrl.valid) {
        this.online = true
        // TODO: Bypass pre-flight request by implementing a url checker on
        // our backend
        // try {
        //   const { status } = await this.$axios.get(newVal, {
        //     crossDomain: true
        //   })
        //   this.online = status === 200
        // } catch (err) {
        //   this.online = false
        // }
      }
    }
  }
}

export const saveMixin = {
  methods: {
    async onSave({ application, editing }) {
      const { fr, en, ...rest } = application
      let payload = _.omit(
        {
          ...fr,
          language: 'fr',
          translation: [
            {
              ...en,
              language: 'en'
            }
          ],
          ...rest
        },
        ['deletedAt', 'createdAt', 'updatedAt', '_id']
      )

      console.log({
        base: payload,
        target: this.original || {},
        diff: differenceObject(payload, this.original || {})
      })

      // payload = differenceObject(payload, this.original || {})
      let response = null
      try {
        if (editing) {
          await this.$axios.put(
            `/applications/${this.$route.params.id}`,
            payload
          )
        } else {
          response = await this.$axios.post('/applications', payload)
        }

        const actionSuccessLabel = editing ? 'modifié' : 'ajouté'

        Swal.fire({
          type: 'success',
          title: `Application ${actionSuccessLabel}`,
          html: `
            <p>Application <strong>${payload.name}</strong>&nbsp;
            ${actionSuccessLabel} avec succès!</p>
          `,
          timer: 2000
        }).then(result => {
          const route = {
            name: 'applications-id',
            params: {
              id: editing ? this.$route.params.id : response.data.result._id
            }
          }
          this.$router.push(route)
        })
      } catch (err) {
        console.error(err)

        Swal.fire({
          type: 'error',
          title: 'Ooops',
          html: `
            <p>Une erreur est survenue, veuillez réessayer plus tard</p>
          `,
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: 'Ok'
        })
      }
    }
  }
}

export const restoreMixin = {
  methods: {
    async onRestore({ application, editing }) {
      // payload = differenceObject(payload, this.original || {})
      try {
        await this.$axios.put(`/applications/${this.$route.params.id}/restore`)

        const actionSuccessLabel = 'restaurée'

        Swal.fire({
          type: 'success',
          title: `Application ${actionSuccessLabel}`,
          html: `
            <p>Application &nbsp;
            <strong>${actionSuccessLabel}</strong> avec succès!</p>
          `,
          timer: 2000
        }).then(result => {
          const route = {
            name: 'applications-id',
            params: {
              id: editing ? this.$route.params.id : response.data.result._id
            }
          }
          this.$router.push(route)
        })
      } catch (err) {
        console.error(err)

        Swal.fire({
          type: 'error',
          title: 'Ooops',
          html: `
            <p>Une erreur est survenue, veuillez réessayer plus tard</p>
          `,
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: 'Ok'
        })
      }
    }
  }
}

export const deleteMixin = {
  methods: {
    onDelete() {
      Swal.fire({
        type: 'question',
        title: 'Placer dans la corbeille',
        html: `
              <p>Etes-vous sûre de vouloir placer l'application <strong>${
                this.current.name
              }</strong> dans la corbeille!</p>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuller'
      }).then(async result => {
        if (result.value) {
          try {
            await this.$axios.delete(`/applications/${this.$route.params.id}`)
            Swal.fire({
              type: 'success',
              title: `Objet placé dans la corbeille`,
              html: `
                <p>Application <strong>${
                  this.current.name
                }</strong> placé dans la corbeille avec succès!</p>
              `,
              timer: 2000
            }).then(result => {
              if (result.value) {
                this.$router.replace({
                  name: 'applications'
                })
              }
            })
          } catch (err) {
            Swal.fire({
              type: 'error',
              title: 'Ooops',
              html: `
                <p>Une erreur est survenue, veuillez réessayer plus tard</p>
              `,
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonText: 'Ok'
            })
          }
        }
      })
    }
  }
}
