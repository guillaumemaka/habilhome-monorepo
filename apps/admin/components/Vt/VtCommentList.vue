<template>
  <div class="md-layout">
    <VtComment
    class="md-layout-item md-size-100"
    :key="comment._id"
    v-for="comment in comments"
    email="comment.email">
    {{comment.content}}
    </VtComment>
  </div>
</template>

<script>
import VtComment from '@/components/Vt/VtComment.vue'

export default {
  components: {
    VtComment
  },
  props: {
    comments: Array
  }
}
</script>

<style>

</style>
