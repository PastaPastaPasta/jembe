<template>
  <v-container :fill-height="!$vuetify.breakpoint.xs">
    <Mobile class="hidden-sm-and-up" /> <Desktop class="hidden-xs-only" />
  </v-container>
</template>

<script>
import Mobile from '~/components/login/Mobile'
import Desktop from '~/components/login/Desktop'

export default {
  components: { Mobile, Desktop }
}
</script>
