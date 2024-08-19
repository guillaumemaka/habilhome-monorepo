import _ from 'lodash'
import Swal from 'sweetalert2'

export const baseMixin = {
  data () {
    return {
      title: 'Utilisateurs > Ajouter un utilisateur',
      description: '',
      loaded: false,
      error: null,
      currentLang: 'fr'
    }
  },
  computed: {
    active () {
      return this.user.active
    },
    activeLabel () {
      return this.active ? 'Actif' : 'Inactif'
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
      const { data } = await app.$axios.get(`/users/${params.id}`)

      const title = `Utilisateurs > ${data.result.firstName} ${
        data.result.lastName
      }`

      return {
        original: _.cloneDeep(data.result),
        title,
        loaded: true,
        user: data.result,
        error: null
      }
    } catch (err) {
      if (err.response) {
        return { loaded: true, error: err.response.data, user: null }
      } else {
        return { loaded: true, error: err.message, user: null }
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
      },
      confirmPassword: ''
    }
  },
  computed: {
    passwordValidation () {
      return this.edit ? 'min:8|max:15' : 'required|min:8|max:15'
    },
    passwordConfirmValidation () {
      return 'confirmed:password'
    }
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default () {
        return {
          active: false,
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          roles: []
        }
      }
    }
  },
  methods: {
    onSave () {
      this.$emit('on-save', {
        user: { ...this.user, passwordConfirm: this.confirmPassword },
        editing: this.edit
      })
    }
  }
}

export const saveMixin = {
  methods: {
    async onSave ({ user, editing }) {
      try {
        console.log(user, editing)
        if (editing) {
          await this.$axios.put(`/users/${this.$route.params.id}`, user)
        } else {
          await this.$axios.post('/users', user)
        }

        const actionSuccessLabel = editing ? 'modifié' : 'ajouté'

        Swal.fire({
          type: 'success',
          title: `Utilisateur ${actionSuccessLabel}`,
          html: `
            <p>Utilisateur <strong>${user.firstname} ${
            user.lastname
          }</strong>&nbsp;
            ${actionSuccessLabel} avec succès!</p>
          `,
          timer: 2000
        }).then(result => {
          this.$router.replace({
            name: 'users'
          })
        })
      } catch (err) {
        console.error(err)

        if (err.response && err.response.data && err.response.data.message) {
          let message = 'Une erreur est survenue, veuillez réessayer plus tard.'
          let title = 'Ooops'

          switch (err.response.data.message) {
            case 'user_already_exist': {
              message = `L'utilisateur avec l'email <strong>${user.email}</strong> existe déjà.`
              break
            }
            default:
              break
          }

          Swal.fire({
            type: 'error',
            title,
            html: `
              <p>${message}</p>
            `,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
        } else {
          Swal.fire({
            type: 'error',
            title: 'Ooops',
            html: `
              <p>Une erreur est survenue, veuillez réessayer plus tard.</p>
            `,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
        }
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
              <p>Etes-vous sûre de vouloir placer l'utilisateur <strong>
              ${this.user.firstname} ${
          this.user.lastname
        }</strong> dans la corbeille!</p>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuller'
      }).then(async result => {
        if (result.value) {
          try {
            await this.$axios.delete(`/users/${this.$route.params.id}`)
            Swal.fire({
              type: 'success',
              title: `Utilisateur placé dans la corbeille`,
              html: `
                <p>Questionnaire <strong>${
                  this.current.name
                }</strong> placé dans la corbeille avec succès!</p>
              `,
              timer: 2000
            }).then(result => {
              if (result.value) {
                this.$router.replace({
                  name: 'surveys'
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
