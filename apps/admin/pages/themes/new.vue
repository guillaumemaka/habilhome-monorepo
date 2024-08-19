<template>
  <vt-theme-form @on-save="onSave" :upload-progress="uploadProgress" />
</template>

<script>
import VtThemeForm from '@/components/Vt/VtThemeForm.vue'
import { saveMixin } from '@/components/Vt/themeMixins'

export default {
  components: {
    VtThemeForm
  },
  mixins: [saveMixin]
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
