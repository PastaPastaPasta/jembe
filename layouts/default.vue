<template>
  <v-app>
    <v-navigation-drawer
      v-if="!isIndexRoute"
      v-model="drawer"
      class="hidden-md-and-up"
      disable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              style="font-family: 'Montserrat', sans-serif; font-size: 1.5rem"
              v-text="item.title"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense elevation="1" color="white" flat fixed app>
      <v-app-bar-nav-icon
        v-if="!isIndexRoute"
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      />
      <v-spacer />
      <a href="./">
        <v-img
          :src="require('~/assets/d-logo.png')"
          class="mx-2"
          max-height="40"
          max-width="40"
          contain
        />
      </a>

      <v-toolbar-title
        style="font-family: 'Montserrat', sans-serif;font-size: 1.5rem"
        v-text="title"
      />

      <v-toolbar-items v-if="!isIndexRoute" class="hidden-sm-and-down">
        <v-divider class="mx-4" vertical></v-divider>
        <v-btn class="ml-1" text to="/discover" nuxt>Home</v-btn>
        <v-divider class="mx-4" vertical></v-divider>
        <v-btn class="ml-1" text to="/users" nuxt>Users</v-btn>
        <v-divider class="mx-4" vertical></v-divider>
        <v-text-field
          class="mt-1"
          dense
          label="Search Jembe"
          outlined
          rounded
          single-line
          append-icon="mdi-magnify"
        ></v-text-field>
        <v-divider class="mx-4" vertical></v-divider>
        <v-menu offset-y open-on-hover="">
          <template v-slot:activator="{ on }">
            <v-btn text elevation="0" v-on="on">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="require('~/assets/avataaar.png')"
                ></v-img>
              </v-list-item-avatar>
              {{ userName }}
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item dense router exact @click="goto('/profile')">
              <v-list-item-content>
                <v-list-item-title>My Profile </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item dense router exact @click="goto('/')">
              <v-list-item-content>
                <v-list-item-title>Logout </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-spacer />
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      items: [
        {
          icon: '',
          title: 'Home',
          to: '/'
        },
        {
          icon: '',
          title: 'Profile',
          to: '/me'
        },
        {
          icon: '',
          title: 'Users',
          to: '/users'
        },
        {
          icon: '',
          title: 'Logout',
          to: '/logout'
        }
      ],
      title: 'Jembe',
      drawer: false
    }
  },
  computed: {
    userName() {
      return this.$store.state.name.label
    },
    isIndexRoute() {
      const isIndex = this.$route.name === 'index'
      console.log({ isIndex })
      return isIndex
    }
  },
  async created() {
    await this.initWallet()
  },
  mounted() {
    console.log(this.$route)
  },
  methods: {
    ...mapActions(['initWallet']),
    goto(route) {
      this.$router.push(route)
    }
  }
}
</script>
