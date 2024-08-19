<template>
  <vt-user-form :user="user" :edit="true" @on-save="onSave" />
</template>

<script>
import VtUserForm from '@/components/Vt/VtUserForm.vue'
import { baseMixin, asyncDataMixin, saveMixin } from '@/components/Vt/userMixins'

export default {
  components: {
    VtUserForm
  },
  middleware: ['isAdmin'],
  mixins: [baseMixin, asyncDataMixin, saveMixin]
}
</script>

<style>

</style>
