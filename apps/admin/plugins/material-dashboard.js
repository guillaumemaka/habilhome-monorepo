import Vue from 'vue'

// Validation plugin used to validate forms
import en from 'vee-validate/dist/locale/en'
import fr from 'vee-validate/dist/locale/fr'

import VeeValidate, {Validator} from 'vee-validate'
// A plugin file where you could register global components used across the app
import GlobalComponents from '@/plugins/globalComponents'
// A plugin file where you could register global directives
import GlobalDirectives from '@/plugins/globalDirectives'

// Tabs plugin. Used on Panels page.

import VueMaterial from 'vue-material'
import { ValidationObserver } from 'vee-validate'

// asset imports
import 'vue-material/dist/vue-material.min.css'
import '~/assets/scss/material-dashboard.scss'

// library auto imports
import 'es6-promise/auto'

Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(VueMaterial)
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields',
  locale: 'fr'
})
Vue.use(ValidationObserver)
Validator.localize('en', en)
Validator.localize('fr', fr)
