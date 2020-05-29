<template>
  <div>
    <v-text-field
      v-model="name"
      class="mx-auto"
      style="font-size: 1.6rem;
    font-weight: 700;
    padding-top: .5em;
    padding-bottom: .5em;"
      outlined
      label="Username"
      :value="this.$store.state.name.label"
      :disabled="this.$store.state.isSyncing"
      :rules="nameRules"
      :error-messages="nameErrors"
      :success-messages="nameSuccess"
      :messages="nameMessages"
      @keyup="validateName($event)"
      @input="validateName($event)"
    />
    <v-text-field
      v-if="nameExists"
      v-model="loginPin"
      style="font-size: 1.6rem;
    font-weight: 700;
    padding-top: .5em;
    padding-bottom: .5em;"
      outlined
      label="Login PIN"
      :rules="loginPinRules"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  data() {
    return {
      name: '',
      nameExists: false,
      nameErrors: [],
      nameSuccess: [],
      nameMessages: [],
      loginPin: '',
      loginPinRules: [
        (v) => !!v || 'Enter the Login PIN shown in your wallet.',
        (v) => /^\d{6}$/.test(v) || 'Please enter a 6 digit number.'
      ],
      nameRules: [
        (v) => !!v || "Let's start with who your are..",
        (v) => (!!v && v.length < 64) || 'Name can be max 63 characters.',
        (v) =>
          /^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])$/.test(v) ||
          'Name can consists of A-Z,  0-9 and - within the name'
      ]
    }
  },
  computed: {},
  created() {
    this.name = this.$store.state.name.label
  },
  methods: {
    ...mapActions(['dashNameExists', 'registerNameOnceBalance']),
    signUp() {
      console.log('signup')
      console.log(this.$store.state.name.isValid)
      if (this.$store.state.name.isValid) {
        this.$store.commit('setSyncing', true)
        this.registerNameOnceBalance()
      }
    },
    enter() {
      this.$router.push('/discover')
    },
    validateName(event) {
      this.nameErrors = []
      this.nameSuccess = []
      this.nameMessages = []

      // Save v-model value in store.state
      // TODO replace with get / set
      this.setName(this.name)

      // Set invalid until proven valid
      this.$store.commit('setNameValid', false)
      this.nameExists = false

      // Clear old timeouts so we don't hit dapi with stale requests
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      // Debounce typing input
      this.timer = setTimeout(() => {
        if (
          this.name &&
          /^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])$/.test(this.name) &&
          this.name.length < 64
        )
          this.checkIfNameExists(this.name, event)
      }, 300)
    },
    async checkIfNameExists(searchName, event) {
      console.log('Checking if name is taken: ', searchName)
      // Did the user change the name since the last debounce interval? Then return early..
      if (this.name !== searchName) return

      // Hit dapi to check if dpns name exists
      this.nameMessages = ['Checking if name is registered..']
      const nameExists = await this.dashNameExists(searchName)

      // Did the user change the name since hitting dapi? Return early..
      if (this.name !== searchName) return

      // Name exists or it doesn't :-)
      if (!nameExists) {
        this.nameErrors = [
          `${searchName} is not registered, double check your spelling..`
        ]
        this.nameSuccess = []
        this.$store.commit('setNameValid', false)
        this.nameExists = false
        this.setName(this.name)
      } else {
        this.nameErrors = []
        this.nameSuccess = [`${searchName} is registered, ready to log in`]
        this.$store.commit('setNameValid', true)
        this.nameExists = true
        this.setName(this.name)
        if (event.keyCode === 13) this.enter()
      }
    },
    setName(name) {
      console.log('commiting name')
      this.$store.commit('setName', name)
    }
  }
}
</script>
