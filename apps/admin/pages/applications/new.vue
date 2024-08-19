<template>
  <vt-application-form @on-save="onSave" />
</template>

<script>
import VtApplicationForm from '@/components/Vt/VtApplicationForm.vue'
import { saveMixin } from '@/components/Vt/applicationMixins'

export default {
  components: {
    VtApplicationForm
  },
  mixins: [saveMixin]
}
</script>

<style lang="scss" scoped>
// @import '~/assets/scss/app.scss';

// .app_image {
//   width: 150px;
//   height: 150px;
// }
// .flex-column {
//   flex-flow: row-reverse;
// }

// .md-field + .md-checkbox {
//   margin: 0 !important;
// }

// .md-checkbox + .md-field {
//   margin: 0 !important;
// }

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
