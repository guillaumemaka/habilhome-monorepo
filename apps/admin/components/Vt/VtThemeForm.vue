<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100">
      <md-card>
        <md-content class="pa-4">
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <div class="md-layout">
                <div class="md-layout-item">
                  <div class="md-layout md-alignment-top-center">
                    <div class="app_image">
                      <input ref="inputFile" accept="image/jpeg,image/png" style="display:none" type="file" @change="onFileSelected">
                      <img class="md-layout-item" :src="getIcon('md')" @click="$refs.inputFile.click()">
                      <!-- <md-icon v-else @click="$refs.inputFile.click()" class="md-layout-item md-size-5x app_image">{{theme.icon}}</md-icon> -->
                      <md-button v-if="file" class="reset-icon md-button md-round md-just-icon md-raised" @click="$refs.inputFile.click()">
                        <md-icon>replay</md-icon>
                      </md-button>
                      <md-progress-spinner v-if="uploadProgress" class="upload-progress" md-mode="determinate" :md-value="uploadProgress" />
                    </div>
                    <md-switch v-model="theme.draft" class="md-layout-item">
                      {{ label }}
                    </md-switch>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-85">
              <section class="md-card-tabs">
                <md-list class="flex-column">
                  <md-list-item :class="{'active md-rose':currentLang === 'en'}" @click.prevent="setLang('en')">
                    Anglais
                  </md-list-item>
                  <md-list-item :class="{'active md-rose':currentLang === 'fr'}" @click.prevent="setLang('fr')">
                    Français
                  </md-list-item>
                </md-list>
              </section>
              <section>
                <form>
                  <h2 class="text-rose">
                    Informations générales
                  </h2>
                  <hr>
                  <md-field :class="errorClass('name')">
                    <label>Nom du thème</label>
                    <md-input v-model="current.name" v-validate="'required'" class="large-text" data-vv-as="Nom du thème" name="name" type="text" />
                    <span v-if="fields && fields.name && fields.name.invalid" class="md-error text-right">{{ errors.first('name') }}</span>
                    <span class="md-helper-text">Donnez un nom court et concis décrivant ce thème</span>
                  </md-field>

                  <md-field :class="errorClass('description')">
                    <label>Description</label>
                    <md-input v-model="current.description" name="description" type="text" />
                    <!-- <span v-if="fields && fields.description && fields.description.invalid" class="md-error text-right">{{ errors.first('description') }}</span> -->
                    <span class="md-helper-text">Donnez une courte description pour ce thème</span>
                  </md-field>

                  <md-field>
                    <label>Sous-Thèmes</label>
                    <md-chips v-model="current.subThemes" class="md-primary" md-placeholder="Appuyez sur la touche entrée pour ajouter">
                      <div class="md-helper-text">
                        <div :style="{paddingTop: '2em'}">
                          <md-icon>help</md-icon> Saisissez votre sous-thème puis appuyez sur la touche Entrée pour l'ajouter.
                        </div>
                      </div>
                    </md-chips>
                  </md-field>

                  <div class="buttons-wrapper">
                    <md-button class="pull-left md-round md-rose" @click="$router.go(-1)">
                      <md-icon>chevron_left</md-icon> Retour
                    </md-button>
                    <md-button class="pull-right md-round md-success" :disabled="!isFormValid" @click="onSave">
                      <md-icon>done</md-icon> Enregistrer
                    </md-button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </md-content>
      </md-card>
    </div>

    <!-- MD ICONS MODAL -->
    <vt-material-icons-browser :open="browseIcons" @on-select-icon="onSelectIcon" @close="browseIcons = false" />
    <!-- END MD ICONS MODAL -->
  </div>
</template>

<script>
import { baseMixin, formMixin } from '@/components/Vt/themeMixins'
import { validationMixin } from '@/components/Vt/validationMixins'
import VtMaterialIconsBrowser from '@/components/Vt/VtMaterialIconsBrowser.vue'

export default {
  components: {
    VtMaterialIconsBrowser,
  },
  mixins: [baseMixin, formMixin, validationMixin],
  data() {
    return {
      browseIcons: false,
      diameter: 150,
      amount: 50,
    }
  },
  methods: {
    getIcon(size) {
      const { icon } = this.theme

      if (this.file) return this.file

      if (icon && icon[size]) {
        return icon[size].location
      }
      return '/img/app_img_placeholder.svg'
    },
    onSelectIcon(icon) {
      this.theme.icon = icon
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.buttons-wrapper {
  margin: 3em 0;
  padding: 0;
}

.reset-icon {
  display: block;
  background-color: white;
  border-radius: 100%;
  position: absolute;
  right: -5px;
  bottom: -15px;
}

.app_image {
  border: 2px solid lightgray;
  position: relative;
  width: 150px;
  height: 150px;

  cursor: pointer;

  img {
    width: 150px;
    height: 150px;
  }

  .upload-progress {
    position: absolute;
    top: 25px;
    left: 40px;
  }
}

.flex-column {
  flex-flow: row-reverse;
}

form {
  .md-field ~ h2,
  .md-checkbox ~ h2 {
    margin-top: 1em;
  }

  hr + .md-field,
  hr + .md-checkbox {
    margin-bottom: 1em;
  }
}
</style>
