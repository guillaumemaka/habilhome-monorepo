<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <nav-tabs-card class="p-2">
        <template slot="content">
          <span :style="{fontSize: '1.5rem'}" class="px-2 md-nav-tabs-title"><strong>{{title}}</strong></span>
          <md-tabs class="md-primary" md-alignment="right">
            <md-tab :href="`#${section.section}`" :key="$idx" v-for="(section, $idx) in sections" :id="`tab-${section.section}`" :md-label="section.section" />
          </md-tabs>

          <div class="mt-3" :id="`#${section.section}`" :key="$idx" v-for="(section, $idx) in sections" >
            <header>
              <h2>{{section.section}}</h2>
            </header>
            <section class="mt-1">
              <div class="px-1" :key="$idx" v-for="(field, $idx) in section.fields">
                <component :is="getComp(field)" v-bind="getAttrs(section.section, field)" v-model="field.value" @on-field-save="saveField"/>
              </div>
            </section>
          </div>

          <md-empty-state
            v-if="sections && sections.length === 0"
            md-rounded
            md-icon="settings"
            md-label="Il n'y a rien à afficher"
            md-description="Aucun utilisateur trouvée.">
          </md-empty-state>

        </template>
      </nav-tabs-card>
    </div>
  </div>
</template>

<script>
import { Badge, Pagination, NavTabsCard } from '@/components'
import InputField from '@/components/Vt/InputField.vue'
import SwitchField from '@/components/Vt/SwitchField.vue'

export default {
  components: {
    Badge,
    Pagination,
    NavTabsCard,
    InputField,
    SwitchField
  },
  data() {
    return {
      title: 'Configuration'
    }
  },
  async asyncData({app}) {
    const {data} = await app.$axios.get('/config')

    return {
      sections: data.sections
    }
  },
  methods: {
    getComp(field) {
      switch (field.valueType.toLowerCase()) {
        case 'url':
        case 'string': {
          return 'input-field'
        }
        case 'boolean': {
          return 'switch-field'
        }
      }
    },
    getAttrs(section, field) {
      const valueType = field.valueType.toLowerCase()
      const validations = ['url', 'email'].reduce((prev, curr) => {
        const r = new RegExp(curr, 'i')
        if (r.test(valueType) || r.test(field.name)) {
          prev.push(curr)
        }
        return prev
      }, [])

      if(field.required) {
        validations.push('required')
      }

      switch (valueType) {
        case 'url':
        case 'string': {
          const { description, name, label, _id: id, required, value } = field
          const type = field.valueType.toLowerCase() === 'url' ? 'url' : 'text'
          return {
            description,
            name,
            label,
            id,
            placeholder: label,
            type,
            required,
            section,
            validations,
            value
          }
        }
        case 'boolean': {
          const { description, name, label, _id: id, required, value } = field

          return {
            description,
            name,
            label,
            id,
            required,
            section,
            validations,
            value
          }
        }
      }
    },
    saveField (field) {
      this.$axios.put(`/config/${field.section}/${field.name}`, {
        value: field.value
      })
    }
  },
  mounted () {
    this.$store.dispatch('SET_TITLE', this.title)
  }
}
</script>

<style>

</style>
