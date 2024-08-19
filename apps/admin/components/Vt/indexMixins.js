export default {
  computed: {
    activeTab () {
      if (this.$route.query.withTrash || this.$route.query.deleted) {
        return 'deleted'
      } else if (this.$route.query.withDraft) {
        return 'drafted'
      } else if (
        this.$route.query.withDraft !== undefined &&
        this.$route.query.withDraft === false
      ) {
        return 'published'
      } else if (this.$route.query.active) {
        return 'active'
      } else if (
        this.$route.query.active &&
        this.$route.query.active === false) {
        return 'inactive'
      } else {
        return 'all'
      }
    }
  },
  methods: {
    filter (query) {
      this.$router.push({
        name: this.$route.name,
        query
      })
    }
  },
  watchQuery: ['withTrash', 'withDraft', 'active', 'deleted']
}
