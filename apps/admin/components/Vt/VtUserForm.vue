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
                    <md-switch class="md-layout-item" v-model="user.active">{{activeLabel}}</md-switch>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-85">
              <!-- <section class="md-card-tabs">
                <md-list class="flex-column">
                  <md-list-item :class="{'active md-rose':currentLang === 'en'}" @click.prevent="setLang('en')">Anglais</md-list-item>
                  <md-list-item :class="{'active md-rose':currentLang === 'fr'}" @click.prevent="setLang('fr')">Français</md-list-item>
                </md-list>
              </section> -->
              <section>
                <form autocomplete="off">
                  <h2 class="text-rose">Informations sur l'utilisateur</h2>
                  <hr>
                  <md-field :class="errorClass('firstName')">
                    <label>Prénom</label>
                    <md-input data-vv-as="Prénom" v-validate="'required'" name="firstName" type="text" v-model="user.firstName"></md-input>
                    <span class="md-helper-text">Prénom de l'utilisateur</span>
                    <span class="md-error">{{ errors.first('firstName') }}</span>
                  </md-field>

                  <md-field :class="errorClass('lastName')">
                    <label>Nom</label>
                    <md-input data-vv-as="Nom" name="lastName" type="text" v-model="user.lastName"></md-input>
                    <span class="md-helper-text">Nom de l'utilisateur</span>
                    <span class="md-error">{{ errors.first('lastName') }}</span>
                  </md-field>

                  <md-field :class="errorClass('email')">
                    <label>Adresse email</label>
                    <md-input autocomplete="off" data-vv-as="Adresse email" v-validate="'required|email'" name="email" type="email" v-model="user.email"></md-input>
                    <span class="md-helper-text">Adresse email de l'utilisateur</span>
                    <span class="md-error">{{ errors.first('email') }}</span>
                  </md-field>

                  <md-field>
                    <label for="roles">Roles</label>
                    <md-select v-model="user.roles" name="roles" id="roles" multiple>
                      <md-option value="admin">Administrateur</md-option>
                      <md-option value="user">Utilisateur</md-option>
                    </md-select>
                  </md-field>

                  <md-field :class="[errorClass('password')]">
                    <label>Mot de passe</label>
                    <md-input ref="password" autocomplete="new-password" type="password" data-vv-as="Mot de passe" v-validate="passwordValidation" name="password" v-model="user.password"></md-input>
                    <span class="md-helper-text">Saisissez le mot de passe de l'utilisateur.</span>
                    <span class="md-error">{{ errors.first('password') }}</span>
                  </md-field>

                  <md-field :class="errorClass('confirmPassword')">
                    <label>Confirmez le mot de passe</label>
                    <md-input autocomplete="new-password" data-vv-as="Confirmez le mot de passe" type="password" v-validate="'confirmed:password'" name="confirmPassword" v-model="confirmPassword"></md-input>
                    <span class="md-helper-text">Saisissez de nouveau le mot de passe.</span>
                    <span class="md-error">{{ errors.first('confirmPassword') }}</span>
                  </md-field>

                  <div class="mt-3">
                    <md-button class="pull-left md-round md-rose" @click="$router.go(-1)">
                      <md-icon>chevron_left</md-icon> Retour
                    </md-button>
                    <md-button class="pull-right md-round md-success" :disabled="edit ? !isFormValid : !isFormDirty || !isFormValid" @click="onSave">
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
  </div>
</template>

<script>
import { baseMixin, formMixin } from '@/components/Vt/userMixins'
import { validationMixin } from '@/components/Vt/validationMixins'

export default {
  mixins: [baseMixin, formMixin, validationMixin]
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
