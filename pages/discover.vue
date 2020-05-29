<template>
  <v-container fluid style="background-color: #f1f1f1;">
    <Message />
    <Tweet v-for="(jam, i) in getJams" :key="i" :jam="jam" />
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapActions, mapGetters } from 'vuex'
import Tweet from '~/components/tweet'
import Message from '~/components/message.vue'

export default {
  components: { Tweet, Message },
  data() {
    return {}
  },
  async created() {
    await this.fetchJams({ orderBy: [['timestamp', 'desc']] })
    await this.refreshLikesInState()
  },
  methods: {
    ...mapActions(['fetchJams', 'refreshLikesInState']),
  },
  computed: {
    ...mapGetters(['getJams']),
  },
}
</script>
