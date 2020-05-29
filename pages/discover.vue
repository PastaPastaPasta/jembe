<template>
  <v-container fluid style="background-color: #f1f1f1">
    <Message />
    <Tweet />
    <Tweet />
    <Tweet />
  </v-container>
</template>

<script>
import Tweet from '~/components/tweet'
import Message from '~/components/message.vue'

export default {
  components: { Tweet, Message }
}
</script>
