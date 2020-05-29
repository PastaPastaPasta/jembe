<template>
  <v-card class="my-2 mx-auto" max-width="600">
    <v-card-title>
      <v-list-item-avatar color="grey darken-3">
        <v-img
          class="elevation-6"
          :src="require('~/assets/avataaar.png')"
        ></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="color: #008de4;">{{
          jam.userId
        }}</v-list-item-title>
        <timeago
          class="subtitle-1"
          :datetime="date(jam.timestamp)"
          :auto-update="60"
        />
      </v-list-item-content>
    </v-card-title>

    <v-card-text class="subtitle-1">
      {{ jam.text }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-row align="center" justify="end">
          <v-btn text @click.stop="follow($vnode.key)"
            >{{
              $store.getters.getFollows[jam.userId] ? 'Following' : 'Follow'
            }}
          </v-btn>
          <v-spacer />
          <v-icon class="mr-1">mdi-twitter-retweet</v-icon>
          <span class="subheading mr-2">3</span>
          <span class="mr-1">·</span>
          <v-icon
            class="mr-1"
            :color="jam.iLiked.isLiked ? '#008de4' : ''"
            @click.stop="like($vnode.key)"
            >{{
              jam.iLiked.isLiked ? 'mdi-heart' : 'mdi-heart-outline'
            }}</v-icon
          >
          <span class="subheading mr-2">{{ jam.likes }}</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1" @click.stop="tip($vnode.key)"
            >mdi-bitcoin
          </v-icon>
          <span class="subheading mr-2">(duffs)</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Tweet',
  props: { jam: Object },
  computed: {
    ...mapGetters(['getJams']),
  },
  mounted() {},
  methods: {
    ...mapActions([
      'likeJam',
      'countLikes',
      'followJammer',
      'showSnackbar',
      'sendDash',
    ]),
    tip(i) {
      console.log('tipping i', i)
      this.sendDash({ amount: 10000 })
    },
    date(timestamp) {
      return new Date(timestamp * 1000)
    },
    // eslint-disable-next-line require-await
    async follow(i) {
      const jams = this.getJams

      const jammerId = jams[i].userId
      const isFollowing = !this.$store.state.follows[jammerId]
      console.log('isFollowing :>> ', isFollowing)
      await this.showSnackbar({
        text: `Following: ${isFollowing}`,
        color: 'green',
      })
      await this.followJammer({ jammerId, isFollowing })
    },
    async like(i) {
      const jams = this.getJams

      const jamId = jams[i].$id
      const isLiked = !jams[i].iLiked.isLiked

      await this.likeJam({ jamId, isLiked })
      await this.countLikes({ jamId })
    },
  },
}
</script>
