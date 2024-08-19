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
                    <img class="md-layout-item app_image" :src="(imageUrl && fields && fields.imageUrl && fields.imageUrl.valid) ? imageUrl : '/img/app_img_placeholder.svg'" alt="">
                    <md-switch class="md-layout-item" v-model="object.draft">{{label}}</md-switch>
                    <md-button @click="object.favorite = !object.favorite" :class="[{
                        'md-rose': object.favorite
                      }, 'md-layout-item md-size-5 md-round md-just-icon']">
                      <md-icon>{{object.favorite ? 'favorite' : 'favorite_border'}}</md-icon>
                    </md-button>
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
                <form @submit.prevent="onSubmit">
                  <h2 class="text-rose mb-2">Habitudes de vie (Tags)</h2>
                  <hr/>
                  <vt-theme-input-field class="mt-3" :selected-themes="current.subThemes" :lang="currentLang" @on-theme-selected="onThemeSelected" @on-theme-removed="onThemeRemoved" />

                  <h2 class="text-rose mt-4 mb-2">Informations générales</h2>
                  <hr/>
                  <md-field :class="errorClass('name')">
                    <label>Nom de l'objet</label>
                    <md-input class="large-text" v-validate.initial="'required'" data-vv-as="Nom de l'objet" name="name" type="text" v-model="current.name"></md-input>
                    <span class="md-error">{{errors.first('name')}}</span>
                  </md-field>

                  <md-field>
                    <label>Nom de la compagnie</label>
                    <md-input name="companyName" type="text" v-model="current.companyName"></md-input>
                  </md-field>

                  <md-field :class="{
                        'md-valid': imageUrl && fields.imageUrl && fields.imageUrl.valid,
                        'md-invalid': fields.imageUrl && fields.imageUrl.invalid
                      }">
                    <label>Image URL</label>
                    <md-input v-validate="{url: {require_protocol: true }}" data-vv-as="Image URL" name="imageUrl" type="url" v-model="object.imageUrl"></md-input>
                    <!-- <md-icon v-if="imageUrl && imageUrl !== ''" :class="{
                        'md-success': fields.imageUrl && (fields.imageUrl.valid || online),
                        'md-danger': fields.imageUrl && (fields.imageUrl.invalid || !online)
                      }">{{ imageUrlIcon }}</md-icon> -->
                    <span class="md-error">{{errors.first('imageUrl')}}</span>
                  </md-field>

                  <md-field>
                    <label>Description</label>
                    <md-textarea md-autogrow name="decription" v-model="current.description"></md-textarea>
                  </md-field>

                  <!-- <md-field>
                    <label>Abilités Requises</label>
                    <md-textarea md-autogrow name="requiredAbilities" v-model="current.requiredAbilities"></md-textarea>
                  </md-field> -->

                  <!-- <md-field>
                    <label>Détails</label>
                    <md-textarea md-autogrow name="details" v-model="current.details"></md-textarea>
                  </md-field> -->
                  <div :class="[errorClass('priceLow'), 'md-layout md-alignment-center-center mb-0']">
                    <div class="md-layout-item pl-0">
                      <md-field :class="errorClass('priceLow')">
                        <label>Prix minimum</label>
                        <md-input type="text" :disabled="object.price.free" name="priceLow" v-model="object.price.low"></md-input>
                        <span class="md-suffix">{{object.price.currency}}</span>
                        <span class="md-error">{{errors.first('priceLow')}}</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item">
                      <md-field :class="errorClass('priceHigh')">
                        <label>Prix maximum</label>
                        <md-input type="text" :disabled="object.price.fixedPrice || object.price.free" name="priceHigh" v-model="object.price.high"></md-input>
                        <span class="md-suffix">{{object.price.currency}}</span>
                        <span class="md-error">{{errors.first('priceHigh')}}</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item">
                      <md-field>
                        <label>Devise</label>
                        <md-select :disabled="object.price.free" name="currency" v-model="object.price.currency">
                          <md-option value="USD" selected="selected">United States Dollars</md-option>
                          <md-option value="EUR">Euro</md-option>
                          <!-- <md-option value="GBP">United Kingdom Pounds</md-option>
                          <md-option value="DZD">Algeria Dinars</md-option>
                          <md-option value="ARP">Argentina Pesos</md-option>
                          <md-option value="AUD">Australia Dollars</md-option>
                          <md-option value="ATS">Austria Schillings</md-option>
                          <md-option value="BSD">Bahamas Dollars</md-option>
                          <md-option value="BBD">Barbados Dollars</md-option>
                          <md-option value="BEF">Belgium Francs</md-option>
                          <md-option value="BMD">Bermuda Dollars</md-option>
                          <md-option value="BRR">Brazil Real</md-option>
                          <md-option value="BGL">Bulgaria Lev</md-option> -->
                          <md-option value="CAD">Canada Dollars</md-option>
                          <!-- <md-option value="CLP">Chile Pesos</md-option>
                          <md-option value="CNY">China Yuan Renmimbi</md-option>
                          <md-option value="CYP">Cyprus Pounds</md-option>
                          <md-option value="CSK">Czech Republic Koruna</md-option>
                          <md-option value="DKK">Denmark Kroner</md-option>
                          <md-option value="NLG">Dutch Guilders</md-option>
                          <md-option value="XCD">Eastern Caribbean Dollars</md-option>
                          <md-option value="EGP">Egypt Pounds</md-option>
                          <md-option value="FJD">Fiji Dollars</md-option>
                          <md-option value="FIM">Finland Markka</md-option>
                          <md-option value="FRF">France Francs</md-option>
                          <md-option value="DEM">Germany Deutsche Marks</md-option>
                          <md-option value="XAU">Gold Ounces</md-option>
                          <md-option value="GRD">Greece Drachmas</md-option>
                          <md-option value="HKD">Hong Kong Dollars</md-option>
                          <md-option value="HUF">Hungary Forint</md-option>
                          <md-option value="ISK">Iceland Krona</md-option>
                          <md-option value="INR">India Rupees</md-option>
                          <md-option value="IDR">Indonesia Rupiah</md-option>
                          <md-option value="IEP">Ireland Punt</md-option>
                          <md-option value="ILS">Israel New Shekels</md-option>
                          <md-option value="ITL">Italy Lira</md-option>
                          <md-option value="JMD">Jamaica Dollars</md-option>
                          <md-option value="JPY">Japan Yen</md-option>
                          <md-option value="JOD">Jordan Dinar</md-option>
                          <md-option value="KRW">Korea (South) Won</md-option>
                          <md-option value="LBP">Lebanon Pounds</md-option>
                          <md-option value="LUF">Luxembourg Francs</md-option>
                          <md-option value="MYR">Malaysia Ringgit</md-option>
                          <md-option value="MXP">Mexico Pesos</md-option>
                          <md-option value="NLG">Netherlands Guilders</md-option>
                          <md-option value="NZD">New Zealand Dollars</md-option>
                          <md-option value="NOK">Norway Kroner</md-option>
                          <md-option value="PKR">Pakistan Rupees</md-option>
                          <md-option value="XPD">Palladium Ounces</md-option>
                          <md-option value="PHP">Philippines Pesos</md-option>
                          <md-option value="XPT">Platinum Ounces</md-option>
                          <md-option value="PLZ">Poland Zloty</md-option>
                          <md-option value="PTE">Portugal Escudo</md-option>
                          <md-option value="ROL">Romania Leu</md-option>
                          <md-option value="RUR">Russia Rubles</md-option>
                          <md-option value="SAR">Saudi Arabia Riyal</md-option>
                          <md-option value="XAG">Silver Ounces</md-option>
                          <md-option value="SGD">Singapore Dollars</md-option>
                          <md-option value="SKK">Slovakia Koruna</md-option>
                          <md-option value="ZAR">South Africa Rand</md-option>
                          <md-option value="KRW">South Korea Won</md-option>
                          <md-option value="ESP">Spain Pesetas</md-option>
                          <md-option value="XDR">Special Drawing Right (IMF)</md-option>
                          <md-option value="SDD">Sudan Dinar</md-option>
                          <md-option value="SEK">Sweden Krona</md-option>
                          <md-option value="CHF">Switzerland Francs</md-option>
                          <md-option value="TWD">Taiwan Dollars</md-option>
                          <md-option value="THB">Thailand Baht</md-option>
                          <md-option value="TTD">Trinidad and Tobago Dollars</md-option>
                          <md-option value="TRL">Turkey Lira</md-option>
                          <md-option value="VEB">Venezuela Bolivar</md-option>
                          <md-option value="ZMK">Zambia Kwacha</md-option>
                          <md-option value="EUR">Euro</md-option>
                          <md-option value="XCD">Eastern Caribbean Dollars</md-option>
                          <md-option value="XDR">Special Drawing Right (IMF)</md-option>
                          <md-option value="XAG">Silver Ounces</md-option>
                          <md-option value="XAU">Gold Ounces</md-option>
                          <md-option value="XPD">Palladium Ounces</md-option>
                          <md-option value="XPT">Platinum Ounces</md-option> -->
                        </md-select>
                      </md-field>
                    </div>
                  </div>
                  <md-checkbox :disabled="object.price.variable || object.price.free" v-model="object.price.fixedPrice">Prix fixe</md-checkbox>
                  <md-checkbox :disabled="object.price.fixedPrice || object.price.free" v-model="object.price.variable">Variable</md-checkbox>
                  <md-checkbox :disabled="object.price.variable || object.price.fixedPrice" v-model="object.price.free">Gratuit</md-checkbox>
                  <md-checkbox v-model="object.price.inAppPurchased">Contient des achats intègrés</md-checkbox>

                  <!-- <h2 class="text-rose mb-2">Système d'exploitation</h2>
                  <hr/>
                  <md-field>
                    <label>OS</label>
                    <md-textarea md-autogrow name="os" v-model="current.os"></md-textarea>
                  </md-field> -->

                  <h2 class="text-rose mb-2 mt-4">Commentaire et précisions</h2>
                  <hr/>
                  <md-field>
                    <label>Précision</label>
                    <md-textarea md-autogrow name="precision" v-model="current.precision"></md-textarea>
                  </md-field>

                  <!-- <h2 class="text-rose mb-2">Restrictions</h2>
                  <hr/>
                  <md-field>
                    <label>Restrictions</label>
                    <md-textarea md-autogrow name="deviceRestriction" v-model="current.deviceRestriction"></md-textarea>
                  </md-field> -->

                  <!-- <h2 class="text-rose mb-2"></h2>
                  <hr/> -->
                  <md-field>
                    <label>Application Mobile Nécessaire</label>
                    <md-textarea md-autogrow name="mobileAppNeeded" v-model="current.mobileAppNeeded"></md-textarea>
                  </md-field>

                  <!-- <h2 class="text-rose mb-2">Appareils Additionnels</h2>
                  <hr/> -->
                  <!-- <md-field>
                    <label>Appareils Additionnels</label>
                    <md-textarea md-autogrow name="additionalDeviceNeeded" v-model="current.additionalDeviceNeeded"></md-textarea>
                  </md-field> -->

                  <!-- <h2 class="text-rose mb-2">Appareil Complémentaire</h2>
                  <hr/> -->
                  <!-- <md-field>
                    <label>Appareil Complémentaire</label>
                    <md-textarea md-autogrow name="complementaryDevice" v-model="current.complementaryDevice"></md-textarea>
                  </md-field> -->

                  <h2 class="text-rose mb-2 mt-4">
                    <span>Liens complémentaires</span>
                    <md-button class="right md-rose md-just-icon md-round" @click="addLink()">
                      <md-icon size-3x>add</md-icon>
                    </md-button>
                  </h2>
                  <hr/>
                  <md-empty-state v-if="!current.links.length" md-icon="link" md-label="Ajouter un lien" md-description="Ajoutez tous liens ayant un rapport avec cete object ex: site web, support, service client...">
                    <md-button @click="addLink" class="md-primary md-raised">Ajouter un lien</md-button>
                  </md-empty-state>

                  <div class="my-4" :key="`link_${index}`" v-for="(item, index) in current.links">
                    <md-field :class="[errorClass('title', `link_${index}`), '']">
                      <label>Titre/Libéllé</label>
                      <md-input v-validate="'required'" v-model="item.title" name="title" data-vv-as="Titre/Libéllé" :data-vv-scope="`link_${index}`"></md-input>
                      <span class="md-error" v-show="errors.has('title', `link_${index}`)">{{ errors.first('title', `link_${index}`) }}</span>
                    </md-field>
                    <md-field :class="[errorClass('href', `link_${index}`), '']">
                      <label>Url (Optionnel)</label>
                      <md-input v-validated="{required: false, url: {require_protocol: true }}" data-vv-as="Url" v-model="item.url" name="href" :data-vv-scope="`link_${index}`"></md-input>
                      <span v-show="errors.has('href', `link_${index}`)" class="md-error">{{errors.first('href', `link_${index}`)}}</span>
                      <md-button class="md-just-icon md-simple" @click="deleteLink(index)">
                        <md-icon>delete</md-icon>
                      </md-button>
                    </md-field>
                  </div>

                  <md-button class="pull-left md-round md-rose" @click="$router.go(-1)">
                    <md-icon>chevron_left</md-icon> Retour
                  </md-button>
                  <md-button :disabled="!isFormValid" class="pull-right md-round md-rose" type="submit">
                    <md-icon>done</md-icon> Enregistrer</md-button>
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
import { baseMixin, formMixin } from '@/components/Vt/connectedObjectMixins'
import { validationMixin } from '@/components/Vt/validationMixins'
import VtThemeInputField from '@/components/Vt/VtThemeInputField.vue'

export default {
  data () {
    return {
      selectedThemes: []
    }
  },
  components: {VtThemeInputField},
  mixins: [baseMixin, formMixin, validationMixin],
  computed: {
    priceLowValidations() {
      return 'decimal:2'
    },
    priceHighValidations() {
      if (this.object.price.variable) {
        return 'decimal:2'
      }

      return ''
    },
  },
  methods: {
    onThemeSelected(theme) {
      this.object.fr.subThemes.push(theme.fr.subTheme)
      this.object.en.subThemes.push(theme.en.subTheme)
      // this.current.themes.push(theme.name)
      // this.selectedThemes.push(theme)
      // this.application[this.currentLang].themes.push(
      //   theme[this.currentLang].parent
      // )
      // this.application[this.currentLang].subThemes.push(
      //   theme[this.currentLang].name
      // )
      // this.application.en.themes.push(theme.en.parent)
      // this.application.en.subThemes.push(theme.en.name)
    },
    onThemeRemoved(text, index) {
      this.object.fr.subThemes.splice(index, 1)
      this.object.en.subThemes.splice(index, 1)
      // this.current.subThemes = this.current.subThemes.filter(
      //   t => t !== text
      // )

      // const themes = this.selectedThemes
      //   .filter(t => t.subThemes === text)
      //   .map(t => t.name)

      // this.current.themes = difference(this.current.themes, themes)

      // this.selectedThemes = this.selectedThemes.filter(t => !themes.includes(t.name))
    }
  },
  mounted() {
    if(this.editing) {
      this.$nextTick(() => {
        this.$validator.validateAll()
      })
    }
  },
  watch: {
    'object.price.free': function() {
      this.object.price.high = null
      this.object.price.low = null
      this.$validator.reset()
    },
    'object.price.fixedPrice': function() {
      this.object.price.high = null
      this.$validator.reset()
    },
    'object.price.variable': function() {
      if(!this.object.price.high){
        this.object.price.high = null
      }

      if(!this.object.price.low){
        this.object.price.low = null
      }

      this.$validator.reset()
    },
    'object.price.inAppPurchased': function() {
      this.$validator.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~/assets/scss/app.scss';

.app_image {
  width: 150px;
  height: 150px;
}
.flex-column {
  flex-flow: row-reverse;
}

// form {
//   .md-field ~ h2,
//   .md-checkbox ~ h2 {
//     margin-top: 1em;
//   }

//   hr + .md-field,
//   hr + .md-checkbox {
//     margin-bottom: 1em;
//   }
// }
</style>
