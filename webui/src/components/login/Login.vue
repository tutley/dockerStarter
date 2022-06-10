<template>
  <v-card class="px-4">
      <v-card-title>
        Login
      </v-card-title>
      <v-card-text>
          <v-form ref="loginForm" v-model="valid">
              <v-row>
                  <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="password" :append-icon="show1?'eye':'eye-off'" :rules="passwordRules" :type="show1 ? 'text' : 'password'" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" xsm="12">
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                      <v-btn block :disabled="!valid" color="success" @click="submit"> Login </v-btn>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                      <v-btn block color="warning" to="/">Cancel</v-btn>
                  </v-col>
                </v-row>
                <v-row><v-col>&nbsp;</v-col></v-row>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    Don't have an account?
                    <v-btn text to="signup" color="secondary">Sign Up Now</v-btn>
                  </v-col>
                </v-row>
          </v-form>
      </v-card-text>
  </v-card>
</template>

<script>
import Auth from '@/plugins/auth'

export default {
  name: 'login-form',
  data () {
    return {
      show1: false,
      valid: false,
      redirect: '/',
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || "Minimum 8 characters"
      ],
    }
  },
  mounted() {
    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("redirect")) {
      this.redirect = searchParams.get("redirect")
    }
  },
  methods: {
    submit () {
      const credentials = {
        email: this.email,
        password: this.password
      }
      Auth.login(credentials, this.redirect)
    }
  }
}

</script>


