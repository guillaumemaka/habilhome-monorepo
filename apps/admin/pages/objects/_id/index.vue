<template>
   <div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100">
        <md-card>
          <md-content class="pa-4">
            <div v-if="loaded && object" class="md-layout md-gutter">
              <div class="md-layout-item md-size-15">
                <div class="md-layout">
                  <div class="md-layout-item">
                    <div class="md-layout text-center md-alignment-top-center">
                      <img class="md-layout-item app_image mb-2" :src="imageUrl ? imageUrl : '/img/app_img_placeholder.svg'" alt="">
                      <div class="md-layout-item ">
                        <badge class="mb-2" :type="object.draft ? 'danger' : 'success'">{{label}}</badge>
                      </div>
                      <div class="md-layout-item ">
                        <md-button
                          disabled
                          :class="[{
                            'md-rose': object.favorite
                          }, 'md-size-5 md-round md-just-icon']"><md-icon>{{object.favorite ? 'favorite' : 'favorite_border'}}</md-icon></md-button>
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
                    <h4>Nom de l'object</h4>
                    <p class="large-text">{{ current.name }}</p>
                  </div>
                  <div>
                    <h4>Image URL</h4>
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
                    <h4>Nom de la compagnie</h4>
                    <p>{{ current.companyName }}</p>
                  </div>
                  <div>
                    <h4>Description</h4>
                    <p>{{ current.description }}</p>
                  </div>

                  <h2 class="text-rose">Informations complémentaires</h2>
                  <hr/>

                  <div class="mt-2">
                    <h4>Abilités Requises</h4>
                    <p v-if="current.requiredAbilities">{{ current.requiredAbilities }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

                  <div class="mt-2">
                    <h4>Application Mobile Nécessaire</h4>
                    <p v-if="current.mobileAppNeeded">{{ current.mobileAppNeeded }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

                  <div class="mt-2">
                    <h4>Appareila Additionnels</h4>
                    <p v-if="current.additionalDeviceNeeded">{{ current.additionalDeviceNeeded }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

                  <div class="mt-2">
                    <h4>Appareils Complémentaires</h4>
                    <p v-if="current.complementaryDevice">{{ current.complementaryDevice }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

                  <div>
                      <h4>Prix</h4>
                      <span>{{price}}</span>
                  </div>

                  <h2 class="text-rose mb-1 mt-3">Liens complémentaires</h2>
                  <hr/>
                  <md-empty-state
                    v-if="!current.links.length"
                    md-icon="link"
                    md-h4="Aucun liens"
                    md-description="Aucun liens n'a été renseigné pour cette object">
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
                    <p v-if="current.precision">{{ current.precision }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

                  <h2 class="text-rose">Restrictions</h2>
                  <hr/>
                  <div class="mt-2">
                    <p v-if="current.deviceRestrictions">{{ current.deviceRestrictions }}</p>
                    <p v-else><em>Non Renseigné</em></p>
                  </div>

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
      <!-- <nuxt-link :to="{name: 'objects-id-edit', params: {id: $route.params.id}}" :class="[{'md-primary': !edit, 'md-danger': edit}, 'md-button bottom-right md-round md-just-icon md-raised']">
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
        <nuxt-link tag="md-button" :to="{name: 'objects-id-edit', params: {id: $route.params.id}}" class="md-primary md-button md-round md-just-icon md-raised md-icon-button">
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
import { baseMixin, asyncDataMixin, deleteMixin } from '@/components/Vt/connectedObjectMixins'
import { Badge } from '@/components'

import _ from 'lodash'

export default {
  components: {
    Badge
  },
  mixins: [baseMixin, asyncDataMixin, deleteMixin]
}
</script>

<style lang="scss" scoped>
h4 {
  font-weight: 400;
}

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

hr {
  margin-bottom: 1rem;
}
</style>
