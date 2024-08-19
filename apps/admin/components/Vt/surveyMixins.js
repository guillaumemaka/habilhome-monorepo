import _ from 'lodash'
import Swal from 'sweetalert2'
import { differenceObject } from '../../lib/utils'

export const baseMixin = {
  data () {
    return {
      title: 'Questinnaires > Ajouter un questionnaire',
      description: '',
      loaded: false,
      error: null,
      currentLang: 'fr'
    }
  },
  computed: {
    draft () {
      return this.survey.draft
    },
    active () {
      return this.survey.active
    },
    draftLabel () {
      return !this.draft ? 'Brouillon' : 'Publiée'
    },
    activeLabel () {
      return this.active ? 'En cours' : 'Terminé'
    },
    current () {
      return this.survey[this.currentLang]
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

export const asyncDataMixin = {
  async asyncData ({ app, params }) {
    if (!params.id) {
      return {}
    }

    try {
      const { data } = await app.$axios.get(`/surveys/${params.id}`)

      const title = `Questionnaires > ${data.result.name}`
      const { draft, active } = data.result
      const fr = _.omit(data.result, ['translation'])
      const otherLanguages = data.result.translation.reduce((acc, t) => {
        acc[t.language] = {
          name: '',
          questions: [],
          comment: '',
          language: '',
          ...t
        }
        return acc
      }, {})

      return {
        original: _.cloneDeep(data.result),
        title,
        loaded: true,
        survey: {
          active,
          draft,
          translated: false,
          fr,
          ...otherLanguages
        },
        error: null
      }
    } catch (err) {
      if (err.request) {
        return { loaded: true, error: err.data.message, survey: null }
      } else {
        return { loaded: true, error: err.message, survey: null }
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
    survey: {
      type: Object,
      default () {
        return {
          active: false,
          draft: true,
          translated: false,
          fr: {
            name: '',
            questions: [],
            language: 'fr'
          },
          en: {
            name: '',
            questions: [],
            language: 'en'
          }
        }
      }
    }
  },
  computed: {
    current () {
      return this.survey[this.currentLang]
    }
  },
  methods: {
    onSave () {
      this.$emit('on-save', {
        survey: this.survey,
        editing: this.edit
      })
    },
    addQuestion () {
      for (const lang in ['fr', 'en']) {
        if (!this.survey[lang].questions) {
          this.survey[lang].questions = []
          this.survey[lang].questions = []
        }

        this.survey[lang].questions = [
          ...this.survey[lang].questions,
          { text: '', answerLabels: [] }
        ]
      }
    },
    deleteQuestion (index) {
      for (const lang in ['fr', 'en']) {
        if (index > this.survey[lang].questions.length) {
          return
        }

        this.survey[lang].questions.splice(index, 1)
      }
    }
  }
}

export const saveMixin = {
  methods: {
    async onSave ({ survey, editing }) {
      const { fr, en, ...rest } = survey
      let payload = _.omit(
        {
          ...rest,
          ...fr,
          language: 'fr',
          translation: [
            {
              ...en,
              language: 'en'
            }
          ]
        },
        ['deletedAt', 'createdAt', 'updatedAt', '_id']
      )

      console.log({
        base: payload,
        target: this.original || {},
        diff: differenceObject(payload, this.original || {})
      })

      payload = differenceObject(payload, this.original || {})

      try {
        if (editing) {
          await this.$axios.put(`/surveys/${this.$route.params.id}`, payload)
        } else {
          await this.$axios.post('/surveys', payload)
        }

        const actionSuccessLabel = editing ? 'modifié' : 'ajouté'

        Swal.fire({
          type: 'success',
          title: `Questionnaire ${actionSuccessLabel}`,
          html: `
            <p>Questionnaire <strong>${payload.name}</strong>&nbsp;
            ${actionSuccessLabel} avec succès!</p>
          `,
          timer: 2000
        }).then(result => {
          if (result.value) {
            this.$router.replace({
              path: this.$route.path
            })
          }
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
              <p>Etes-vous sûre de vouloir placer le questionnaire <strong>${
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
              title: `Questionnaire placé dans la corbeille`,
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
