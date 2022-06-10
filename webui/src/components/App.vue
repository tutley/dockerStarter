<template>
  <v-app>
    <v-navigation-drawer
      absolute
      temporary
      v-model="drawer"
      light
    >
      <v-list>
        <!-- <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img :src="require('@/assets/icon.png')"></v-img>
          </v-list-item-avatar>
        </v-list-item> -->
        <v-list-item>
          <v-list-item-title v-if="(isLoggedIn && profile)" class="text-h6">
            {{ profile.firstName }} {{ profile.lastName }}
          </v-list-item-title>
          <v-list-item-title v-else class="text-h6">
            Hello There
          </v-list-item-title>          
          <v-btn
            icon
            @click.stop="drawer = !drawer"
            >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="blue--text text-accent-4">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            exact
            :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ item.title }}</v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="isLoggedIn"
            @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>Logout</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app dark dense color="primary"
      >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Starter Project</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-banner v-if="isErrorMessage" elevation="8" color="error" single-line transition="slide-y-transition">
          <v-icon
            slot="icon"
            color="white"
            size="36"
            >
            mdi-alert-circle-outline</v-icon>
            <span class="white--text">{{ errorMessage }}</span>
            <template v-slot:actions>
            <v-btn text color="white" @click.stop="dismissAlert">DISMISS</v-btn>
            </template>
        </v-banner>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Auth from '@/plugins/auth'
import api from '@/plugins/api'

import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
     return {
       group: null,
       drawer: false,
      }
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'profile',
      'isErrorMessage',
      'errorMessage',
    ]),
    menuItems() {
      let menuItems = [
        { icon: 'mdi-lock-open', title: 'Sign in', link: '/login' },
        { icon: 'mdi-account-circle', title: 'Sign up', link: '/signup'},
        { icon: 'mdi-help', title: 'Help', link: '/help' }
      ]
      if (this.isLoggedIn) {
        menuItems = [
          { icon: 'mdi-home', title: 'Home', link: '/' },
          { icon: 'mdi-account-circle', title: 'My Account', link: '/account' },
          { icon: 'mdi-help', title: 'Help', link: '/help' }
        ]
      }
      return menuItems
    }
  },
  beforeCreate() {
      // Check localstorage to see if a user is already logged in
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      if (accessToken && refreshToken) {
        this.$store.dispatch('setAccessToken', accessToken)
        this.$store.dispatch('setRefreshToken', refreshToken)

        api.get('/auth/profile')
        .then((response) => {
          const profile = response.data.profile
          this.$store.dispatch('setProfile', profile)
        })
        .catch((errorResponse) => {
          console.log(errorResponse)
        })
      }

  },
  mounted () {
    },
    watch: {
      '$route' () {
        this.$store.dispatch('clearErrorMessage')
      }
    },
  methods: {
    logout () {
      Auth.logout()
    },
    dismissAlert() {
      this.$store.dispatch('clearErrorMessage')
    },
  }
}
</script>
