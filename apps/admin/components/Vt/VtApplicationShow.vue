<template>
  <div class="md-layout">
    <!-- <div class="md-layout-item md-medium-size-100">
      <md-card>
        <md-content class="pa-4">
          <div v-if="loaded && application" class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <div class="md-layout">
                <div class="md-layout-item">
                  <div class="md-layout md-alignment-top-center">
                    <img class="md-layout-item app_image" :src="(current.imageUrl && fields.imageUrl && fields.imageUrl.valid && online) ? current.imageUrl : '/img/app_img_placeholder.svg'" alt="">
                    <md-switch class="md-layout-item" v-model="draft">{{ label }}</md-switch>
                    <md-button
                      @click="favorite = !favorite"
                      :class="[{
                        'md-rose': favorite
                      }, 'md-layout-item md-size-5 md-round md-just-icon']"><md-icon>{{favorite ? 'favorite' : 'favorite_border'}}</md-icon></md-button>
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
                    <md-icon
                      v-if="current.imageUrl"
                      :class="{
                        'md-success': current.imageUrl && online,
                        'md-danger': current.imageUrl && !online
                      }">{{ imageUrlIcon }}</md-icon> {{ current.imageUrl }}
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
                  <p>{{ current.requiredAbilities }}</p>
                </div>
                <div>
                  <h3>Détails</h3>
                  <p>{{ current.details }}</p>
                </div>
                <div>
                    <h3>Prix</h3>
                    <p :v-if="fixedPrice">{{ current.price.low }} <strong v-if="current.inAppPurchased">Contient des achats intégrés</strong></p>
                    <p :v-if="free">Gratuit <strong v-if="current.inAppPurchased">Contient des achats intégrés</strong></p>
                    <p :v-if="!fixedPrice">Entre {{ current.price.low }} et {{ current.price.high }} <strong v-if="current.inAppPurchased">Contient des achats intégrés</strong></p>
                </div>

                <h2 class="text-rose mb-1"><span>Liens complémentaires</span> <md-button class="right md-rose md-just-icon md-round" @click="addLink()"><md-icon size-3x>add</md-icon></md-button></h2>
                <hr/>
                <md-empty-state
                  v-if="!current.links.length"
                  md-icon="link"
                  md-h3="Aucun lien"
                  md-description="Aucun lien n'a été renseigné pour cette application">
                </md-empty-state>
                <div class="md-layout md-gutter md-alignment-center-bottom" :key="`link_${index}`" v-for="(item, index) in current.links">
                  <div class="md-layout-item md-size-15">
                    <h3>Title</h3>
                    <p>{{ item.title }}</p>
                  </div>
                  <div class="md-layout-item md-size-85">
                    <h3>Url</h3>
                    <p>{{ item.href }}</p>
                  </div>
                </div>

                <h2 class="text-rose">Catégories (Thèmes)</h2>
                <hr/>
                <div>
                  <md-chips v-model="current.themes" class="md-rose"></md-chips>
                </div>
              </section>
            </div>
          </div>
          <div class="text-center" v-if="loaded && error">
            <p class="md-danger">Une erreur est survenue. </p>
          </div>
        </md-content>
      </md-card>
    </div> -->
  </div>
</template>

<script>
import { baseMixin, asyncDataMixin } from '@/components/Vt/applicationMixins'

export default {
  mixins: [baseMixin, asyncDataMixin]
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.app_image {
  width: 150px;
  height: 150px;
}
.flex-column {
  flex-flow: row-reverse;
}

form {
  .div ~ h2,
  .md-checkbox ~ h2 {
    margin-top: 1em;
  }

  hr + .div,
  hr + .md-checkbox {
    margin-bottom: 1em;
  }
}
</style>
