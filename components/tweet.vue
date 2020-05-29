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
        <v-list-item-title style="color: #008de4">{{
          this.$store.state.name.label
        }}</v-list-item-title>
        <span class="subtitle-1">
          ~41min ago
        </span>
      </v-list-item-content>
    </v-card-title>

    <v-card-text class="subtitle-1">
      "Turns out semicolon-less style is easier and safer in TS because most
      gotcha edge cases are type invalid as well."
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-row align="center" justify="end">
          <v-icon class="mr-1">mdi-twitter-retweet</v-icon>
          <span class="subheading mr-2">3</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1" :color="isLiked ? 'red' : ''">{{
            isLiked ? 'mdi-heart' : 'mdi-heart-outline'
          }}</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'Tweet',
  props: { isLiked: Boolean }
}
</script>
