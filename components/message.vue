<template>
  <v-card class="pa-4 mx-auto my-10" max-width="600">
    <v-textarea
      name="input-7-1"
      label="Your message"
      value=""
      hint=""
      solo
      flat
      auto-grow=""
      rows="2"
      class="headline"
      :background-color="textValid.backgroundcolor"
      :error="!textValid.isValid"
      @keyup="validateText($event)"
    ></v-textarea>
    <v-card-actions>
      <v-spacer />
      <v-progress-circular
        size="30"
        :value="textValid.value"
        rotate="-90"
        :color="textValid.color"
        :width="textValid.width"
        >{{ textValid.number }}</v-progress-circular
      >
      <v-divider class="mx-4" vertical></v-divider>

      <v-btn
        style="border-top-left-radius: 13px;
    border-bottom-right-radius: 13px;
    border-top-right-radius: 1px;
    border-bottom-left-radius: 1px;"
        color="primary"
        :disabled="!textValid.isValid"
        >Tweet</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      textValid: {
        number: '',
        color: 'primary',
        value: 0,
        width: 2,
        backgroundcolor: 'white',
        isValid: false
      }
    }
  },
  methods: {
    validateText(event) {
      //   console.log({ event })
      //   console.log(event.srcElement.textLength)

      const { textValid } = this
      const amountChars = event.srcElement.textLength
      const allowedChars = 144
      const remainingChars = allowedChars - amountChars

      textValid.value = (amountChars / allowedChars) * 100

      console.log({ remainingChars })
      if (remainingChars >= 20) {
        this.textValid.color = 'primary'
        this.textValid.number = ''
      }
      if (remainingChars < 21) {
        this.textValid.color = 'amber'
        this.textValid.number = remainingChars
      }
      if (remainingChars < 0) {
        this.textValid.color = 'red'
        this.textValid.backgroundcolor = '#ff000033'
        this.textValid.number = remainingChars
        this.textValid.isValid = false
        console.log('should be true', this.textValid.isValid)
      } else {
        this.textValid.isValid = true
        this.textValid.backgroundcolor = 'white'
        console.log('should be false', this.textValid.isValid)
      }

      // Hide circle if text is 3 chars long (incl sign)
      if (remainingChars < -9) {
        this.textValid.width = 0
      } else {
        this.textValid.width = 2
      }
    }
  }
}
</script>
