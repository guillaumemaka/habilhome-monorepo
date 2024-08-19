<template>
  <vt-survey-form @on-save="onSave" />
</template>

<script>
import VtSurveyForm from '@/components/Vt/VtSurveyForm.vue'
import { saveMixin } from '@/components/Vt/surveyMixins'

export default {
  components: {
    VtSurveyForm
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
