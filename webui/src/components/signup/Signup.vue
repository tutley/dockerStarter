<template>
  <v-card class="px-4">
    <v-card-title>
      Sign up today!
    </v-card-title>
    <v-card-text>
      <h4>
        We will send you a confirmation email after you sign up, be on the lookout!
      </h4>
        <v-form ref="registerForm" v-model="valid">
            <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field tabindex="1" v-model="firstName" label="First Name" maxlength="20" :rules="required"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field tabindex="2" v-model="lastName" label="Last Name" maxlength="20" :rules="required"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field tabindex="3" v-model="email" :rules="emailRules" label="E-mail" 
                    required hint="This will also be your username"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field tabindex="4" v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules" 
                    :type="show1 ? 'text' : 'password'" label="Password" hint="At least 8 characters" 
                    counter @click:append="show1 = !show1"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field block tabindex="5" v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="verifyRules" 
                    :type="show1 ? 'text' : 'password'" label="Confirm Password" 
                    counter @click:append="show1 = !show1"></v-text-field>
                </v-col>
                <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                
                  <v-spacer></v-spacer>
                </v-col>
                <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                    <v-btn large tabindex="6" block :disabled="!valid" color="secondary" @click="submit">Register</v-btn>
                </v-col>
                <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                    <v-btn large tabindex="7" block color="warning" to="/">Cancel</v-btn>
                </v-col>       
            </v-row>
        </v-form>
    </v-card-text>
  </v-card>


</template>

<script>
import api from '@/plugins/api'

export default {
  name: 'signup-form',
  data () {
    return {
      valid: true,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      verify: "",
      emailRules: [
        v => !!v || "Required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password Required.",
        v => (v && v.length >= 8) || "Min 8 characters",
      ],
      verifyRules: [
        v => (v && v.length >= 8) || "Min 8 characters",
        v => (v === this.password) || "Passwords must match",
      ],
      required: [
        v => !!v || "Required",
      ],
      show1: false,
    }
  },
  methods: {
    submit () {
      const newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      }
      api.post('/auth/signup', newUser)
        .then((result) => {
          const profile = result.data.profile
          this.$store.dispatch('setProfile', profile)
          this.$router.push('/signup/emailSent')
      })
      .catch((err) => {
        this.$store.dispatch('setErrorMessage', err.response.data.message )
    })
      return
    }
  }
}
</script>
