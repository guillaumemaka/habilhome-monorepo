<template>
  <div>
    <div class="flex">
      <h3 class="flex-1">{{label}}</h3>
      <md-switch @change="onChange" v-bind="$attrs" v-on="$listeners" v-model="localValue">{{localValue ? 'Activé' : 'Désactivé'}}</md-switch>
    </div>
    <p class="help-block text-right">{{description}}</p>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['id', 'label', 'description', 'name', 'section', 'value'],
  data () {
    return {
      v: null
    }
  },
  computed: {
    localValue: {
      get(){
        return this.v
      },
      set(value) {
        this.v = value
      }
    }
  },
  methods: {
    onChange (value) {
      this.$emit('on-field-save', {
        section: this.section,
        name: this.name,
        value: value,
        id: this.id
      })
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
