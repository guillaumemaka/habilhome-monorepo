<template>
  <vt-user-form @on-save="onSave" />
</template>

<script>
import VtUserForm from '@/components/Vt/VtUserForm.vue'
import { saveMixin } from '@/components/Vt/userMixins'

export default {
  components: {
    VtUserForm
  },
  middleware: ['isAdmin'],
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
