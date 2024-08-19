<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-15">
      <img src="" alt="">
    </div>
    <div class="md-layout-item md-size-85">
      <p><slot></slot></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    },
    reply: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
