<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100">
        <md-card>
          <md-content class="pa-4">
            <div v-if="loaded && application" class="md-layout md-gutter">
              <div class="md-layout-item md-size-15">
                <div class="md-layout">
                  <div class="md-layout-item">
                    <div class="md-layout text-center md-alignment-top-center">
                      <img class="md-layout-item app_image mb-2" :src="imageUrl ? imageUrl : '/img/app_img_placeholder.svg'" alt="">
                      <div class="md-layout-item">
                        <badge class=" mb-2" :type="application.draft ? 'danger' : 'success'">{{label}}</badge>
                      </div>
                      <div class="md-layout-item">
                        <md-button
                          disabled
                          :class="[{
                            'md-rose': application.favorite
                          }, 'md-size-5 md-round md-just-icon']"><md-icon>{{application.favorite ? 'favorite' : 'favorite_border'}}</md-icon></md-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md-layout-item md-size-85">
                <section class="md-card-tabs">
                  <md-list class="flex-column">
                    <md-list-item :class="{'active md-rose': currentLang === 'en'}" @click.prevent="setLang('en')">Anglais</md-list-item>
                    <md-list-item :class="{'active md-rose': currentLang === 'fr'}" @click.prevent="setLang('fr')">Français</md-list-item>
                  </md-list>
                </section>
                <section>
                  <h2 class="text-rose">Informations générales</h2>
                  <hr/>
                  <div>
                    <h3>Nom de l'application</h3>
                    <p class="large-text">{{ current.name }}</p>
                  </div>
                  <div>
                    <h3>Image URL</h3>
                    <p>
                      <!-- <md-icon
                        v-if="imageUrl"
                        :class="{
                          'md-success': imageUrl && online,
                          'md-danger': imageUrl && !online
                        }">{{ imageUrlIcon }}</md-icon>  -->
                        {{ imageUrl }}
                    </p>
                  </div>
                  <div>
                    <h3>Nom de la compagnie</h3>
                    <p>{{ current.companyName }}</p>
                  </div>
                  <div>
                    <h3>Description</h3>
                    <p>{{ current.description }}</p>
                  </div>
                  <div>
                    <h3>Abilités Requises</h3>
                    <p v-if="current.requiredAbilities" v-html="current.requiredAbilities"></p>
                    <p v-else>Non renseigné</p>
                  </div>

                  <div>
                    <h3>Prix</h3>
                    <p>{{ price }}</p>
                  </div>

                  <h2 class="text-rose mt-2">Liens complémentaires</h2>
                  <hr/>
                  <md-empty-state
                    v-if="!current.links.length"
                    md-icon="link"
                    md-h3="Aucun liens"
                    md-description="Aucun liens n'a été renseigné pour cette application">
                  </md-empty-state>

                  <div class="md-layout md-gutter md-alignment-center-bottom" :key="`link_${index}`" v-for="(link, index) in current.links">
                    <div :class="[{
                      'md-size-100': !link.url,
                      'md-size-15': link.url,
                    }, 'md-layout-item']">
                      <h4>Title</h4>
                      <p>{{ link.title }}</p>
                    </div>
                    <div v-if="link.url" class="md-layout-item md-size-85">
                      <h4>Url</h4>
                      <p>{{ link.url }}</p>
                    </div>
                  </div>

                  <h2 class="text-rose">Commentaire</h2>
                  <hr/>
                  <div class="mt-2">
                    <p>{{ current.comment }}</p>
                  </div>

                  <!-- <h2 class="text-rose">Restrictions</h2>
                  <hr/>
                  <div class="mt-2">
                    <p>{{ current.deviceRestrictions || 'Non renseigné'}}</p>
                  </div> -->

                  <!-- <h2 class="text-rose">Abilités requises</h2>
                  <hr/>
                  <div class="mt-2">
                    <p>{{ current.requiredAbilities }}</p>
                  </div> -->

                  <h2 class="text-rose">Catégories (Thèmes)</h2>
                  <hr/>
                  <div>
                    <md-chips v-model="current.subThemes" class="md-rose" md-static></md-chips>
                  </div>
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
    <!-- <nuxt-link :to="{name: 'applications-id-edit', params: {id: $route.params.id}}" :class="[{'md-primary': !edit, 'md-danger': edit}, 'md-button bottom-right md-round md-just-icon md-raised']">
      <div class="md-ripple">
        <div class="md-button-content">
          <md-icon>{{ edit ? 'close' : 'edit' }}</md-icon>
        </div>
      </div>
    </nuxt-link> -->
    <!-- End Edit Button -->

    <!-- Speed Dial -->
    <md-speed-dial style="z-index:999;" class="md-bottom-right md-fixed">
      <md-speed-dial-target class="md-rose md-button md-round md-just-icon md-raised md-icon-button">
        <md-icon>more_vert</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <nuxt-link tag="md-button" :to="{name: 'applications-id-edit', params: {id: $route.params.id}}" class="md-primary md-button md-round md-just-icon md-raised md-icon-button">
          <md-icon>edit</md-icon>
        </nuxt-link>
      </md-speed-dial-content>

      <md-speed-dial-content>
        <md-button @click="onDelete" class="md-danger md-button md-round md-just-icon md-raised md-icon-button">
          <md-icon>delete</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <!-- End Speed Dial -->
  </div>
</template>

<script>
import { baseMixin, asyncDataMixin, deleteMixin } from '@/components/Vt/applicationMixins'
import { Badge } from '@/components'
import { join } from 'lodash'

import _ from 'lodash'

export default {
  components: {
    Badge
  },
  computed: {
    price() {
      if (!this.application) {
        return
      }

      if (!this.application.price) {
        return 'Aucun prix renseigné'
      }

      const currency = this.application.price.currency || '(Aucune devise renseignée)'

      const inApp = this.application.price.inAppPurchased
        ? `(Contient des achats intégrés)`
        : ''

      let text = this.application.price.free ? 'Gratuit' : ''

      if (this.application.price.fixedPrice) {
        text = `${currency} ${this.application.price.low}`
      }

      if (this.application.price.variable) {
        if (this.application.price.low && this.application.price.high){
          text = `Entre ${this.application.price.low} et ${this.application.price.high}`
        } else {
          text = 'Variable'
        }
      }

      return join([text, inApp], ' - ')
    }
  },
  mixins: [baseMixin, asyncDataMixin, deleteMixin]
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

hr {
  margin-bottom: 1em;
}

h3, h4 {
  font-weight: 400;
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
