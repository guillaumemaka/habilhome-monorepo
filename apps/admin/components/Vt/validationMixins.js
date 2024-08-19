import {Validator} from 'vee-validate'

Validator.extend('greater_than', (value, [otherValue]) => {
  const val = parseFloat(value)
  const other = parseFloat(otherValue)

  return val > other
}, {
  hasTarget: true
})

Validator.extend('greater_than_or_eq', (value, [otherValue]) => {
  return value >= otherValue
}, {
  hasTarget: true
})

Validator.extend('less_than', (value, [otherValue]) => {
  const val = parseFloat(value)
  const other = parseFloat(otherValue)

  return val < other
}, {
  hasTarget: true
})

Validator.extend('less_than_or_eq', (value, [otherValue]) => {
  return value <= otherValue
}, {
  hasTarget: true
})

const dictionnary = {
  fr: {
    messages: {
      less_than_or_eq (field, [target]) {
        if (!target) return ''
        return `Le champ ${field} doit être plus petit ou êgale à ${target}`
      },
      less_than (field, [target]) {
        if (!target) return ''
        return `Le champ ${field} doit être plus petit que ${target}`
      },
      greater_than (field, [target]) {
        if (!target) return ''
        return `Le champ ${field} doit être plus grand que ${target}`
      },
      greater_than_or_eq (field, [target]) {
        if (!target) return ''
        return `Le champ ${field} doit être plus grand ou êgale à ${target}`
      }
    }
  },
  en: {
    messages: {
      less_than_or_eq (field, [target]) {
        if (!target) return ''
        return `The field ${field} must be less than or equal to ${target} value`
      },
      less_than (field, [target]) {
        if (!target) return ''
        return `The field ${field} must be less than to ${target} value`
      },
      greater_than (field, [target]) {
        if (!target) return ''
        return `The field ${field} must be greater than to ${target} value`
      },
      greater_than_or_eq (field, [target]) {
        if (!target) return ''
        return `The field ${field} must be greater than or equal to ${target} value`
      }
    }
  }
}

Validator.localize(dictionnary)

export const validationMixin = {
  computed: {
    isFormDirty () {
      return Object.keys(this.fields).some(key => this.fields[key].dirty)
    },
    isFormPristine () {
      return Object.keys(this.fields).some(key => this.fields[key].pristine)
    },
    isFormValid () {
      // return !Object.keys(this.fields).some(key => this.fields[key].invalid)
      // await this.$validateAll()
      // this.$validator.reset()
      return this.errors.all().length === 0
    }
  },
  methods: {
    errorClass (field, scope = null) {
      return {
        'md-invalid': this.errors.has(field, scope)
      }
    }
  }
}
