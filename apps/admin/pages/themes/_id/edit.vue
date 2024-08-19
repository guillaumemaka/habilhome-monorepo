<template>
  <vt-theme-form :theme="theme" :edit="true" @on-save="onSave" :upload-progress="uploadProgress"/>
</template>

<script>
import VtThemeForm from '@/components/Vt/VtThemeForm.vue'
import { baseMixin, asyncDataMixin, saveMixin } from '@/components/Vt/themeMixins'

export default {
  components: {
    VtThemeForm
  },
  mixins: [baseMixin, asyncDataMixin, saveMixin]
}
</script>

<style>

</style>
