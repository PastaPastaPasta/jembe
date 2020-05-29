<template>
  <v-btn
    style="border-top-left-radius: 13px;
    border-bottom-right-radius: 13px;
    border-top-right-radius: 1px;
    border-bottom-left-radius: 1px;"
    large
    class="ml-2 mb-4"
    color="primary"
    :disabled="!this.$store.state.name.isValid"
    :loading="this.$store.state.isSyncing"
    @click="enter()"
  >
    Login
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapActions(['registerNameOnceBalance']),
    signUp() {
      this.$store.commit('setSyncing', true)
      this.registerNameOnceBalance()
    },
    enter() {
      this.$router.push('/discover')
    }
  }
}
</script>
