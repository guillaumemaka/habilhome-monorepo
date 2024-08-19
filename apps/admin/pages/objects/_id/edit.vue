<template>
  <vt-connected-object-form :object="object" edit="true" @on-save="onSave"/>
</template>

<script>
import VtConnectedObjectForm from '@/components/Vt/VtConnectedObjectForm.vue'
import { baseMixin, asyncDataMixin, saveMixin } from '@/components/Vt/connectedObjectMixins'

export default {
  components: {
    VtConnectedObjectForm
  },
  mixins: [baseMixin, asyncDataMixin, saveMixin]
}
</script>

<style>

</style>
