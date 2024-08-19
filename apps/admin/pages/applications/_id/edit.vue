<template>
  <vt-application-form :application="application" :edit="true" @on-save="onSave" @on-restore="onRestore" />
</template>

<script>
import VtApplicationForm from '@/components/Vt/VtApplicationForm.vue'
import {
  baseMixin,
  asyncDataMixin,
  saveMixin,
  restoreMixin
} from '@/components/Vt/applicationMixins'

export default {
  components: {
    VtApplicationForm
  },
  mixins: [baseMixin, asyncDataMixin, saveMixin, restoreMixin]
}
</script>

<style>
</style>
