<template>
  <div>
    <md-autocomplete class="my-0" v-model="value" :md-options="items" @md-changed="getThemes" @md-selected="onSelect">
      <label>Sous-Thèmes</label>
      <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item[lang].subTheme }}</template>
    </md-autocomplete>
    <md-chips class="py-0 my-0" v-model="selectedThemes" @md-delete="onDelete" md-check-duplicated md-deletable>
      <div class="md-helper-text">
        <md-icon>help</md-icon> Saisissez votre sous-thème puis appuyez sur la touche Entrée pour l'ajouter.
      </div>
    </md-chips>
  </div>
</template>

<script>
export default {
  props: {
    lang: {
      type: String,
      default: 'fr'
    },
    selectedThemes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: null,
      items: []
    }
  },
  methods: {
    onSelect(theme) {
      const val = JSON.parse(JSON.stringify(theme))
      // if (!this.selectedThemes.includes(value[this.lang].subTheme)) {
      this.$emit('on-theme-selected', val)
      this.value = ''
      // }
    },
    onDelete(value, index) {
      this.$emit('on-theme-removed', value, index)
      this.selectedTheme = ''
    },
    getThemes(searchTerm) {
      this.items = new Promise(resolve => {
        window.setTimeout(async () => {
          if (searchTerm && searchTerm.length < 3) {
            resolve([])
          } else {
            try {
              const { data } = await this.$axios.get('/themes', {
                params: {
                  limit: 100,
                  q: searchTerm.replace(' ', '+'),
                  aggregate: true,
                  lang: this.lang
                }
              })

              const results = data.results // .map(t => t[this.lang].subTheme)

              // for (let i = 0; i < data.results.length; i++) {
              //   for (let j = 0; j < data.results[i].subThemes.length; j++) {
              //     results.push({
              //       slug: data.results[i].slug,
              //       fr: { name: data.results[i].subThemes[j], parent: data.results[i].name },
              //       en: { name: data.results[i].translation[0].subThemes[j], parent: data.results[i].translation[0].name }
              //     })
              //   }
              // }

              // const term = unaccent(searchTerm).toLowerCase()

              // const filtered = results.filter(t => {
              //   const lookup = unaccent(t[this.lang].name).toLowerCase()
              //   return lookup.match(term)
              // })

              resolve(results)
            } catch (err) {
              console.error(err)
              resolve([])
            }
          }
        }, 500)
      })
    }
  }
}
</script>

<style>
</style>
