<template>
  <div>
    <div class="flex items-baseline">
      <md-field v-if="edit" :class="['flex-1', errorClass(name)]">
        <label :for="name">{{ label }}</label>
        <md-input v-bind="$attrs" :required="required" v-validate="rules" :data-vv-as="label" :name="name" v-model="localValue" />
        <span class="md-error">{{ errors.first(name) }}</span>
      </md-field>
      <div v-else class="flex-1">
        <h3>{{label}}</h3>
        <strong>{{localValue}}</strong>
      </div>
      <md-button :disabled="!isFormValid" class="md-raised md-primary" @click="editOrSave">{{btnLabel}}</md-button>
      <md-button class="md-accent" v-if="edit" @click="cancel">Annuler</md-button>
    </div>
    <p class="help-block text-gray-700 text-right">{{description}}</p>
  </div>
</template>

<script>
import {validationMixin} from '@/components/Vt/validationMixins'

export default {
  mixins: [validationMixin],
  inheritAttrs: false,
  props: ['label', 'description', 'name', 'required', 'section', 'validations', 'value', 'type'],
  data() {
    return {
      edit: false,
      oldValue: null,
      v: null
    }
  },
  computed: {
    attrs () {
      const {name, type, required, placeholder} = this

      return {name, type, required, placeholder}
    },
    localValue: {
      get(){
        return this.v
      },
      set(value) {
        this.v = value
      }
    },
    btnLabel(){
      return this.edit ? 'Enregistrer' : 'Modifier'
    },
    rules () {
      return this.validations.join('|') //`'${this.validations.join('|')}'`
    }
  },
  methods: {
    cancel() {
      const { oldValue } = this
      this.localValue = oldValue
      this.oldValue = null
      this.edit = !this.edit
    },
    editOrSave() {
      if (this.edit){
        this.$emit('on-field-save', {
          section: this.section,
          name: this.name,
          value: this.localValue
        })
        this.oldValue = null
      } else {
        const { value } = this
        this.oldValue = value
      }

      this.edit = !this.edit
    }
  },
  mounted() {
    const {value} = this
    this.v = value
  }
}
</script>

<style>

</style>
