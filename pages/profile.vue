<template>
  <v-container style="maxwidth: 700px;">
    <v-card flat class="my-2">
      <v-img :src="require('~/assets/avataaar.png')" height="194"></v-img>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline"
            >{{ this.$store.state.name.label
            }}<v-btn
              class="mb-1"
              color="primary"
              elevation="0"
              outlined
              dense
              rounded
              style="float: right;"
              >Set up Profile</v-btn
            ></v-list-item-title
          >
          <v-list-item-subtitle
            >Sending good vibes and a couple of duff.</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-card-text class="subtitle-1">
        <p><v-icon>mdi-calendar-month</v-icon> Joined May 2017</p>
        <p>
          <span style="font-weight: bold;">5</span> Following
          <span style="font-weight: bold;" class="ml-2">47</span> Followers
        </p>
      </v-card-text>
    </v-card>

    <v-tabs fixed-tabs="">
      <v-tab>
        Tweets
      </v-tab>
      <v-tab>
        Following
      </v-tab>
      <v-tab>
        Followers
      </v-tab>
      <v-tab>
        Likes
      </v-tab>
      <v-tab-item>
        <!-- <Tweet /> -->
        <!-- <Tweet /> -->
        <!-- <Tweet /> -->
      </v-tab-item>
      <v-tab-item>
        <v-container fluid style="maxwidth: 600px; display: flex;">
          <Usercard is-followed />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-card flat tile>
          <v-container fluid style="maxwidth: 600px; display: flex;">
            <Usercard is-followed />
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <!-- <Tweet is-liked /> -->
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import Tweet from '~/components/tweet'
import Usercard from '~/components/usercard'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Tweet, Usercard },
}
</script>
