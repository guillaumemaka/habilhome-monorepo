<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100">
        <md-card>
          <md-content class="pa-4">
            <div v-if="loaded && report" class="md-layout md-gutter">
              <div class="md-layout-item md-size-15">
                <div class="md-layout">
                  <div class="md-layout-item">
                    <div class="md-layout md-alignment-top-center">
                      <img class="md-layout-item app_image mb-2" src="/img/app_img_placeholder.svg" alt="">
                      <badge class="mb-2" :type="report.status != 'PASSED' ? 'danger' : 'success'">{{statusLabel}}</badge>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md-layout-item md-size-85">
                <!-- <section class="md-card-tabs">
                  <md-list class="flex-column">
                    <md-list-item :class="{'active md-rose': currentLang === 'en'}" @click.prevent="setLang('en')">Anglais</md-list-item>
                    <md-list-item :class="{'active md-rose': currentLang === 'fr'}" @click.prevent="setLang('fr')">Français</md-list-item>
                  </md-list>
                </section> -->
                <section>
                  <h2 class="text-rose">Détail du rapport</h2>
                  <hr/>
                  <div>
                    <h3>Liens morts</h3>
                    <div>
                      <md-table v-model="report.deadLinks" md-sort="name" md-sort-order="asc" table-header-color="green">
                        <md-table-row slot="md-table-row" slot-scope="{item}">
                          <md-table-cell md-label="Type">
                            <nuxt-link :to="{name: 'reports-id', params: {id: item._id}}">
                              <badge :type="getKindType(item)">{{getKindLabel(item)}}</badge>
                            </nuxt-link>
                          </md-table-cell>
                          <md-table-cell md-label="Name">
                            <nuxt-link :to="{name: 'reports-id', params: {id: item._id}}">
                              {{item.name}}
                            </nuxt-link>
                          </md-table-cell>
                          <md-table-cell md-label="Status retourné">
                            <nuxt-link :to="{name: 'reports-id', params: {id: item._id}}">
                              {{item.status}}
                            </nuxt-link>
                          </md-table-cell>
                          <md-table-cell md-label="Plus d'info sur le status">
                            <a :href=`http://httpstatuses.com/${item.status}` target="__blank">
                              Plus d'info
                            </a>
                          </md-table-cell>
                          <md-table-cell md-label="Created At">{{ item.createdAt }}</md-table-cell>
                          <md-table-cell md-label="Updated At">{{ item.updatedAt }}</md-table-cell>
                        </md-table-row>
                      </md-table>
                      <md-empty-state v-if="report.deadLinks && report.deadLinks.length === 0" md-rounded md-icon="link_off" md-label="Aucun liens n'a été reporter comme mort" md-description="Aucun rapport à affiché.">
                      </md-empty-state>
                    </div>
                  </div>
                </section>
                <section class="pt-3">
                  <md-button class="pull-left md-round md-rose" @click="$router.go(-1)">
                    <md-icon>chevron_left</md-icon> Retour
                  </md-button>
                </section>
              </div>
            </div>
            <div class="text-center" v-if="loaded && error">
              <p class="md-danger">Une erreur est survenue. </p>
            </div>
          </md-content>
        </md-card>
      </div>
    </div>
    <!-- Edit Button -->
    <!-- <nuxt-link :to="{name: 'objects-id-edit', params: {id: $route.params.id}}" :class="[{'md-primary': !edit, 'md-danger': edit}, 'md-button bottom-right md-round md-just-icon md-raised']">
        <div class="md-ripple">
          <div class="md-button-content">
            <md-icon>{{ edit ? 'close' : 'edit' }}</md-icon>
          </div>
        </div>
      </nuxt-link> -->
    <!-- End Edit Button -->
    <!-- Speed Dial -->
    <!-- End Speed Dial -->
  </div>
</template>

<script>
import { baseMixin, asyncDataMixin } from '@/components/Vt/reportMixins'
import { Badge } from '@/components'
import { mapState } from 'vuex'

export default {
  components: {
    Badge
  },
  middleware: ['isAdmin'],
  mixins: [baseMixin, asyncDataMixin],
  methods: {
    getKindType(item) {
      switch (item.kind) {
        case 'Application':
          return 'apps'
        case 'ConnectedObject':
          return 'settings_remote'
        default:
          return 'Inconnu'
      }
    },
    getKindLabel(item) {
      switch (item.kind) {
        case 'Application':
          return 'Application'
        case 'ConnectedObject':
          return 'Objet connecté'
        default:
          return 'Inconnu'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-column {
  flex-flow: row-reverse;
}

.app_image {
  width: 150px;
  height: 150px;
}

.bottom-right {
  z-index: 10;
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
