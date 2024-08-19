<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <nav-tabs-card>
        <template slot="content">
          <span :style="{fontSize: '1.5rem'}" class="px-2 md-nav-tabs-title"><strong>{{title}}</strong></span>
          <md-tabs :md-active-tab="activeTab" class="md-rose" md-alignment="right">
            <md-tab id="all" md-label="Tout" md-icon="arrow_forward" @click="filter({})"></md-tab>
            <md-tab id="published" md-label="Publiées" md-icon="arrow_forward" @click="filter({withDraft: false})"></md-tab>
            <md-tab id="drafted" md-label="Non Publiées" md-icon="arrow_back" @click="filter({withDraft: true})"></md-tab>
            <md-tab id="deleted" md-label="Supprimées" md-icon="delete_sweep" @click="filter({withTrash: true})"></md-tab>
          </md-tabs>
          <md-table-toolbar>
            <md-field md-clearable class="md-toolbar-section-start">
              <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar>
          <md-table v-model="data.results" md-sort="name" md-sort-order="asc" table-header-color="green">
            <md-table-row slot="md-table-row" slot-scope="{item}">
              <md-table-cell md-label="Name"><nuxt-link :to="{name: 'surveys-id', params: {id: item._id}}">{{ item.name }}</nuxt-link></md-table-cell>
              <md-table-cell md-label="Created At">{{ item.createdAt }}</md-table-cell>
              <md-table-cell md-label="Updated At">{{ item.updatedAt }}</md-table-cell>
              <md-table-cell md-label="Deleted At">{{ item.deletedAt }}</md-table-cell>
            </md-table-row>
          </md-table>
          <md-empty-state
            v-if="data.results && data.results.length === 0"
            md-rounded
            md-icon="settings_remote"
            md-label="Il n'a rien à afficher"
            md-description="Aucun objet connecté trouvée.">
          </md-empty-state>
          <pagination
            no-arrows
            v-model="currentPage"
            :total="data.itemCount"
            :per-page="data.perPage"
            :page-count="data.pageCount">
          </pagination>

          <!-- <md-button to="/applications/new" class="md-fab bottom-right md-round md-just-icon md-raised md-rose">
            <md-icon>add</md-icon>
          </md-button> -->
          <nuxt-link to="/surveys/new" class="md-button bottom-right md-round md-just-icon md-raised md-rose">
            <div class="md-ripple">
              <div class="md-button-content">
                <md-icon>add</md-icon>
              </div>
            </div>
          </nuxt-link>
        </template>
      </nav-tabs-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Pagination, NavTabsCard } from '@/components'
import indexMixin from '@/components/Vt/indexMixins'
import Swal from 'sweetalert2'

export default {
  components: {
    Pagination,
    NavTabsCard
  },
  mixins: [indexMixin],
  data() {
    return {
      search: '',
      currentPage: 1,
      title: 'Questionnaires'
    }
  },
  computed: mapState('surveys', ['data']),
  async fetch({ store, route }){
    await store.dispatch('surveys/GET_SURVEYS', route.query || {})
  },
  mounted () {
    this.$store.dispatch('SET_TITLE', this.title)
  }
}
</script>

<style lang="scss" scoped>
.bottom-right {
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;

  i {
    font-size: 2rem !important;
  }
}
</style>
