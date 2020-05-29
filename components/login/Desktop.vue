<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>
        <v-card flat class="mx-auto" max-width="600px">
          <v-card-text>
            <Headline />
            <Subline class="headline" />
            <NameField />
          </v-card-text>
          <v-card-actions>
            <NameButton />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NameField from './NameField'
import NameButton from './NameButton'
import Headline from './Headline'
import Subline from './Subline'

export default {
  components: { NameField, NameButton, Headline, Subline },
}
</script>
