<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <nav-tabs-card>
        <template slot="content">
          <span :style="{fontSize: '1.5rem'}" class="px-2 md-nav-tabs-title">
            <strong>{{title}}</strong>
          </span>
          <md-tabs :md-active-tab="activeTab" class="md-rose" md-alignment="right">
            <md-tab id="all" md-label="Tout" md-icon="arrow_forward" @click="filter({})"></md-tab>
            <md-tab id="succeed" md-label="Réussis" md-icon="check_circle" @click="filter({status: 'PASSED'})"></md-tab>
            <md-tab id="failed" md-label="Echoués" md-icon="error" @click="filter({status: 'FAILED'})"></md-tab>
            <md-tab id="pending" md-label="En cours" md-icon="hourglass_empty" @click="filter({status: 'PENDING'})"></md-tab>
            <md-tab id="unread" md-label="Non lus" md-icon="markunread" @click="filter({read: false})"></md-tab>
          </md-tabs>
          <!-- <md-table-toolbar>
            <md-field md-clearable class="md-toolbar-section-start">
              <md-input placeholder="Search by status ('PASS')..." v-model="search" @input="searchOnTable" />
            </md-field>
          </md-table-toolbar> -->
          <md-table v-model="data.results" md-sort="name" md-sort-order="asc" table-header-color="green">
            <md-table-row slot="md-table-row" slot-scope="{item}">
              <md-table-cell>
                <md-icon v-if="!item.read">fiber_manual_record</md-icon>
              </md-table-cell>
              <md-table-cell md-label="Status">
                <nuxt-link :to="{name: 'reports-id', params: {id: item._id}}">
                  <badge :type="statusType(item)">{{statusLabel(item)}}</badge>
                </nuxt-link>
              </md-table-cell>
              <md-table-cell md-label="Liens morts détectés">
                <nuxt-link :to="{name: 'reports-id', params: {id: item._id}}">
                  <badge :type="item.deadLinks && item.deadLinks.length > 0 ? 'danger' : 'success'">{{ item.deadLinks && item.deadLinks.length ? item.deadLinks.length : 0 }}</badge>
                </nuxt-link>
              </md-table-cell>
              <md-table-cell md-label="Created At">{{ item.createdAt }}</md-table-cell>
              <md-table-cell md-label="Updated At">{{ item.updatedAt }}</md-table-cell>
            </md-table-row>
          </md-table>
          <md-empty-state v-if="data.results && data.results.length === 0" md-rounded md-icon="assignment" md-label="Il n'y a rien à afficher" md-description="Aucun rapport à affiché.">
          </md-empty-state>
          <pagination class="mt-5 mb-2" v-if="data.results && data.results.length > 0" no-arrows v-model="currentPage" :total="data.itemCount" :per-page="data.perPage" :page-count="data.pageCount">
          </pagination>

          <!-- <md-button to="/applications/new" class="md-fab bottom-right md-round md-just-icon md-raised md-rose">
            <md-icon>add</md-icon>
          </md-button> -->
        </template>
      </nav-tabs-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Badge, Pagination, NavTabsCard } from '@/components'
import indexMixin from '@/components/Vt/indexMixins'
import Swal from 'sweetalert2'

export default {
  components: {
    Badge,
    Pagination,
    NavTabsCard
  },
  middleware: ['isAdmin'],
  mixins: [indexMixin],
  data() {
    return {
      search: '',
      currentPage: 1,
      title: 'Rapports'
    }
  },
  computed: {
    ...mapState('reports', ['data'])
  },
  methods: {
    statusType(report) {
      return report.status === 'PASSED' ? 'success' : 'danger'
    },
    statusLabel(report) {
      return report.status === 'PASSED'
        ? 'Vérification réussites'
        : 'Vérification échouées'
    },
    getReports() {
      this.$store.dispatch('reports/GET_REPORTS', this.$route.query || {})
    }
  },
  async fetch({ store, route }) {
    await store.dispatch('reports/GET_REPORTS', route.query || {})
  },
  mounted() {
    this.$store.dispatch('SET_TITLE', this.title)
  },
  watch: {
    $route: function() {
      this.getReports()
    },
    currentPage(val, oldVal) {
      this.$router.push({ query: { ...this.$route.query, page: val } })
    }
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
