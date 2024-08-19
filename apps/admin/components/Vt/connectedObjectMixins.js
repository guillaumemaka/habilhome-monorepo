import _ from 'lodash'
import Swal from 'sweetalert2'
import {omit} from 'lodash'

export const baseMixin = {
  data () {
    return {
      title: 'Objets > Ajouter un objet',
      description: '',
      loaded: false,
      error: null,
      online: false,
      currentLang: 'fr'
    }
  },
  computed: {
    price () {
      const inapp = this.object.price.inAppPurchased ? '(Contient des achat intégrés.)' : ''
      const currency = this.object.price.currency || '(Aucune devise spécifiée. Le Dollars Canadadien (CAD) sera utilisé par défaut) - CAD'

      if (this.object.price.free) {
        return `Gratuit ${inapp}`
      }

      if (this.object.price.fixedPrice) {
        return `${currency} ${this.object.price.low}  ${inapp}`
      }

      if (this.object.price.variable) {
        if (!this.object.price.low || !this.object.price.high) {
          return `Variable  ${inapp}`
        }

        return `Entre ${currency} ${this.object.price.low} et ${currency} ${this.object.price.high}  ${inapp}`
      }

      return ''
    },
    imageUrlIcon () {
      if (this.fields && this.fields.imageUrl && this.fields.imageUrl.valid) {
        return this.online ? 'cloud_done' : 'cloud_off'
      }

      return this.fields && this.fields.imageUrl && this.fields.imageUrl.valid ? 'check_circle' : 'cancel'
    },
    imageUrl () {
      if (this.object.imageUrl) {
        return this.object.imageUrl
      } else {
        return this.object.fr.imageUrl
      }
    },
    label () {
      return this.object.draft ? 'Brouillon' : 'Publiée'
    },
    current () {
      return this.object[this.currentLang]
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
    async checkLink (url) {
      try {
        const response = await this.$axios.head(url, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        this.online = (response.status === 200)
      } catch (err) {
        this.online = false
      }
    },
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

export const asyncDataMixin = {
  async asyncData ({ app, params }) {
    if (!params.id) {
      return {}
    }

    try {
      const { data } = await app.$axios.get(`/objects/${params.id}`)

      const title = `Objets Connectés > ${data.result.name}`
      const description = data.result.description

      const { price, draft, favorite, imageUrl } = data.result

      const fr = _.omit(data.result, 'translation')
      const otherLanguages = data.result.translation.reduce((acc, t) => {
        acc[t.language] = {
          companyName: '',
          imageUrl: '',
          links: [],
          description: '',
          comment: '',
          themes: [],
          subThemes: [],
          deviceRestritions: '',
          requiredAbilities: '',
          precision: '',
          mobileAppNeeded: '',
          additionalDeviceNeeded: '',
          complementaryDevice: '',
          ...t
        }
        return acc
      }, {})

      return {
        title,
        description,
        loaded: true,
        object: {
          imageUrl,
          favorite,
          draft,
          price,
          fr,
          ...otherLanguages
        },
        error: null
      }
    } catch (err) {
      if (err.request) {
        return { loaded: true, error: err.data.message, object: null }
      } else {
        return { loaded: true, error: err.message, object: null }
      }
    }
  }
}

export const formMixin = {
  data () {
    return {
      appNameLabelStyle: {
        top: '-1.5rem'
      },
      appNameInputStyle: {
        fontSize: '42pt'
      }
    }
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    object: {
      type: Object,
      default () {
        return {
          imageUrl: '',
          favorite: false,
          draft: true,
          price: {
            fixedPrice: false,
            free: false,
            inAppPurchased: false,
            currency: 'CAD',
            low: null,
            hight: null,
            variable: false
          },
          fr: {
            companyName: '',
            imageUrl: '',
            links: [],
            description: '',
            comment: '',
            themes: [],
            subThemes: [],
            deviceRestritions: '',
            requiredAbilities: '',
            precision: '',
            mobileAppNeeded: '',
            additionalDeviceNeeded: '',
            complementaryDevice: ''
          },
          en: {
            companyName: '',
            imageUrl: '',
            links: [],
            description: '',
            comment: '',
            themes: [],
            subThemes: [],
            deviceRestritions: '',
            requiredAbilities: '',
            precision: '',
            mobileAppNeeded: '',
            additionalDeviceNeeded: '',
            complementaryDevice: ''
          }
        }
      }
    }
  },
  computed: {
    current () {
      return this.object[this.currentLang]
    }
  },
  methods: {
    async checkLink (url) {
      try {
        const response = await this.$axios.head(url, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
        this.online = (response.status === 200)
      } catch (err) {
        this.online = false
      }
    },
    onSubmit () {
      this.$emit('on-save', {
        object: this.object,
        editing: this.edit
      })
    },
    addLink () {
      if (!this.object[this.currentLang].links) {
        this.object[this.currentLang].links = []
      }
      this.object[this.currentLang].links = [
        ...this.current.links,
        { title: '', url: '' }
      ]

      this.$nextTick(() => {
        if (this.$validator) {
          this.$validator.validateAll().catch(() => {})
        }
      })
    },
    deleteLink (index) {
      if (index > this.object[this.currentLang].length) {
        return
      }

      this.object[this.currentLang].links.splice(index, 1)
    }
  },
  watch: {
    'current.imageUrl': async function (newVal) {
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
    async onSave ({ object, editing }) {
      const { fr, en, ...rest } = omit(object, ['deletedAt', 'createdAt', 'updatedAt', '_id'])
      const payload = {
        ...fr,
        language: 'fr',
        translation: [{
          ...en,
          language: 'en'
        }],
        ...rest
      }
      let response = null

      try {
        if (editing) {
          await this.$axios.put(`/objects/${this.$route.params.id}`, payload)
        } else {
          response = await this.$axios.post('/objects', payload)
        }

        const actionSuccessLabel = editing ? 'modifié' : 'ajouté'

        Swal.fire({
          type: 'success',
          title: `Objet ${actionSuccessLabel}`,
          html: `
            <p>Objet connecté <strong>${payload.name}</strong> ${actionSuccessLabel} avec succès!</p>
          `,
          timer: 2000
        }).then(result => {
          const route = {
            name: 'objects-id',
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
    onDelete () {
      Swal.fire({
        type: 'question',
        title: 'Placer dans la corbeille',
        html: `
              <p>Etes-vous sûre de vouloir placer l'objet connecté <strong>${this.current.name}</strong> dans la corbeille!</p>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuller'
      }).then(async result => {
        if (result.value) {
          try {
            await this.$axios.delete(`/objects/${this.$route.params.id}`)
            Swal.fire({
              type: 'success',
              title: `Objet placé dans la corbeille`,
              html: `
                <p>Objet connecté <strong>${this.current.name}</strong> placé dans la corbeille avec succès!</p>
              `,
              timer: 2000
            }).then(result => {
              if (result.value) {
                this.$router.replace({
                  name: 'objects'
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
