<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100">
        <md-card>
          <md-content class="pa-4">
            <div v-if="loaded && theme" class="md-layout md-gutter">
              <div class="md-layout-item md-size-15">
                <div class="md-layout">
                  <div class="md-layout-item">
                    <div class="md-layout md-alignment-top-center">
                      <img class="md-layout-item app_image mb-2" :src="getIcon('md')" alt="">
                      <badge class="mb-2" :type="theme.draft ? 'danger' : 'success'">
                        {{ label }}
                      </badge>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md-layout-item md-size-85">
                <section class="md-card-tabs">
                  <md-list class="flex-column">
                    <md-list-item :class="{'active md-rose': currentLang === 'en'}" @click.prevent="setLang('en')">
                      Anglais
                    </md-list-item>
                    <md-list-item :class="{'active md-rose': currentLang === 'fr'}" @click.prevent="setLang('fr')">
                      Français
                    </md-list-item>
                  </md-list>
                </section>
                <section>
                  <h2 class="text-rose">
                    Informations générales
                  </h2>
                  <hr>
                  <div>
                    <h3>Nom du thème</h3>
                    <p class="large-text">
                      {{ current.name }}
                    </p>
                  </div>

                  <h2 class="text-rose">
                    Sous-Thèmes
                  </h2>
                  <hr>
                  <div>
                    <md-chips v-model="current.subThemes" class="md-rose" md-static />
                  </div>
                </section>
              </div>
            </div>
            <div v-if="loaded && error" class="text-center">
              <p class="md-danger">
                Une erreur est survenue.
              </p>
            </div>
          </md-content>
        </md-card>
      </div>
    </div>
    <!-- Edit Button -->
    <!-- <nuxt-link :to="{name: 'themes-id-edit', params: {id: $route.params.id}}" :class="[{'md-primary': !edit, 'md-danger': edit}, 'md-button bottom-right md-round md-just-icon md-raised']">
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
        <nuxt-link tag="md-button" :to="{name: 'themes-id-edit', params: {id: $route.params.id}}" class="md-primary md-button md-round md-just-icon md-raised md-icon-button">
          <md-icon>edit</md-icon>
        </nuxt-link>
      </md-speed-dial-content>

      <md-speed-dial-content>
        <md-button class="md-danger md-button md-round md-just-icon md-raised md-icon-button" @click="onDelete">
          <md-icon>delete</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <!-- End Speed Dial -->
  </div>
</template>

<script>
import { baseMixin, asyncDataMixin } from '@/components/Vt/themeMixins'
import { Badge } from '@/components'
import Swal from 'sweetalert2'
import _ from 'lodash'

export default {
  components: {
    Badge,
  },
  mixins: [baseMixin, asyncDataMixin],
  methods: {
    getIcon(size) {
      const { icon } = this.theme
      if (icon && icon[size]) {
        return icon[size].location
      }
      return '/img/app_img_placeholder.svg'
    },
    onDelete() {
      Swal.fire({
        title: 'Etes-vous sure ?',
        html: `Etes-vous sure de vouloir supprimer l'application ${
          this.current.name
        } ? <br/><em>Cette action marquera l'application comme supprimé. Vous pourrez la restaurée plus tard.</em>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, je confirme!',
      }).then(result => {
        if (result.value) {
          Swal.fire('Supprimée!', 'Application supprimée.', 'success')
        }
      })
    },
  },
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
