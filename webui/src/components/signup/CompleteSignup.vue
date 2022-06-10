<template>
  <v-container>
    <v-row class="text-center">
      <v-card class="px-4" v-if="!verified">
        <v-card-title>
          Verifying email link...
        </v-card-title>
        <v-card-text>
          <h4>
            Just a second...
          </h4>
          <v-row>
              <v-col cols="12" sm="6" md="6">
                  <v-spacer/>
              </v-col>
          </v-row>          
        </v-card-text>
      </v-card>
      <v-card class="px-4" v-if="verified">
        <v-card-title>
          Account Confirmed!
        </v-card-title>
        <v-card-subtitle>
          <h4>
            Email Verification Worked
          </h4>
        </v-card-subtitle>
        <v-card-text>
           You're good to go!
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/plugins/api'
import Auth from '@/plugins/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'signup-complete',
  data () {
    return {
      verified: false,
    }
  },
  props: {
    slug: {
      type: String || null,
      default: '',
    }
  },
  computed: {
    ...mapGetters([
    'profile'
    ]),
  },
  mounted () {
      this.verifyCode()
    },
  methods: {
    verifyCode() {
      if (this.slug !== '') {
      const verificationCode = this.slug
      api.post('/auth/verify', {
        emailVerificationCode: verificationCode
      })
        .then((result) => {
          this.verified = true
          Auth._storeToken(result)
      })
        .catch((errorResponse) => {
            console.log(JSON.stringify(errorResponse, null, 2))
        })
      } else if (this.profile.emailValid) {
        this.verified = true
      }
    },
  }
}
</script>
