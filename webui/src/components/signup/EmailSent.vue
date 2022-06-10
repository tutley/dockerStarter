<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('@/assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4" v-if="!showEmailValidation">
        <h1 class="display-2 font-weight-bold mb-3">
          Go check your inbox!
        </h1>

        <p class="subheading font-weight-regular">
          Welcome {{ profile.firstName }}, we have sent an email with a verification link that will complete the signup process. Just click that link and you'll be ready to go!
        </p>
      </v-col>

      <v-col class="mb-4" v-if="showEmailValidation">
        <h1 class="display-2 font-weight-bold mb-3">
          Email Validation Incomplete
        </h1>

        <p class="subheading font-weight-regular" v-if="!reverifySent">
           Did you receive the validation email we sent to {{ profile.email }}? If not, we can re-send it for you.
        </p>
        <p class="subheading font-weight-regular" v-if="reverifySent">
           Your verification email has been re-sent. Please wait a few minutes and check your email!
        </p>
        <v-btn color="primary" :disabled="reverifySent" @click.stop="resendValidation()">
          Send Email Again
        </v-btn>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/plugins/api'

  export default {
    name: 'email-sent',

    data: () => ({
      reverifySent: false,
    }),
    computed: {
        ...mapGetters([
        'profile',
        'showEmailValidation',
        ]),
    },
    methods: {
      resendValidation() {
        // the email is in the access token so we don't need to send that
        api.post('/auth/resendVerification', {})
          .then(() => {
            this.reverifySent = true
            this.$store.dispatch('setShowEmailValidation', false)
          })
          .catch((err) => {
            this.$store.dispatch('setErrorMessage', err.response.data.message )
          })
      }
    }
  }
</script>