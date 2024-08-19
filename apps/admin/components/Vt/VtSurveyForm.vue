<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100">
      <md-card>
        <md-content class="pa-4">
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <div class="md-layout">
                <div class="md-layout-item">
                  <div class="md-layout md-alignment-center-top">
                    <div class="app_image">
                      <img class="md-layout-item" src="/img/app_img_placeholder.svg">
                    </div>
                    <span>Publier le questionnaire</span>
                    <md-switch class="md-layout-item" v-model="survey.draft">{{draftLabel}}</md-switch>
                    <span>Activer le questionnaire</span>
                    <md-switch class="md-layout-item" v-model="survey.active">{{activeLabel}}</md-switch>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-85">
              <section class="md-card-tabs">
                <md-list class="flex-column">
                  <md-list-item :class="{'active md-rose':currentLang === 'en'}" @click.prevent="setLang('en')">Anglais</md-list-item>
                  <md-list-item :class="{'active md-rose':currentLang === 'fr'}" @click.prevent="setLang('fr')">Français</md-list-item>
                </md-list>
              </section>
              <section>
                <form>
                  <h2 class="text-rose">Informations générales</h2>
                  <hr>
                  <md-field :class="errorClass('name')">
                    <label>Nom du questionnaire</label>
                    <md-input class="large-text" v-validate="'required'" name="name" type="text" v-model="current.name"></md-input>
                    <span v-if="fields && fields.name && fields.name.invalid" class="md-error text-right">{{ errors.first('name') }}</span>
                    <span class="md-helper-text">Donnez un nom court et concis décrivant ce questionnaire</span>
                  </md-field>

                  <md-field>
                    <label>Questions</label>
                    <md-chips v-model="current.subThemes" class="md-primary" md-placeholder="Sous-thèmes..." />
                    <span class="md-helper-text">Ajoutez les sous-thèmes. Appuyez sur la touche Entrée pour ajouter</span>
                  </md-field>

                  <md-button class="pull-left md-round md-rose" @click="$router.go(-1)">
                    <md-icon>chevron_left</md-icon> Retour
                  </md-button>
                  <md-button class="pull-right md-round md-success" :disabled="isFormPristine || !isFormValid" @click="onSave">
                    <md-icon>done</md-icon> Enregistrer
                  </md-button>
                </form>
              </section>
            </div>
          </div>
        </md-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { baseMixin, formMixin } from '@/components/Vt/surveyMixins'
import { validationMixin } from '@/components/Vt/validationMixins'

export default {
  mixins: [baseMixin, formMixin, validationMixin],
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.reset-icon {
  display: block;
  background-color: white;
  border-radius: 100%;
  position: absolute;
  right: 5px;
  bottom: 30px;
}

.app_image {
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
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
