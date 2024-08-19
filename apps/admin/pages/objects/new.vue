<template>
  <vt-connected-object-form @on-save="onSave" />
</template>

<script>
import VtConnectedObjectForm from '@/components/Vt/VtConnectedObjectForm.vue'
import { saveMixin } from '@/components/Vt/connectedObjectMixins'
export default {
  components: {
    VtConnectedObjectForm
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
