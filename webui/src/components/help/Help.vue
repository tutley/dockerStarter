<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="6" xsm="12">
        <div class="text-xs-center">
          <v-text-field 
            name="search"
            v-model="search"
            label="Search Help"></v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="6" xsm="12" v-for="(help, index) in helps" :key="index">
        <v-card elevation="3">
          <v-card-title primary-title class="layout justify-center">
            <v-icon x-large color="primary">{{help.icon}}</v-icon>
            &nbsp;
            <div class="headline text-xs-center">{{help.title}}</div>
          </v-card-title>
          <v-card-text>
            {{help.text}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'help-page',
  props: ['incomingSearch'],
  data() {
    return {
      search: '',
      helpSource: [
        {
          icon: 'mdi-chart-timeline-variant-shimmer',
          title: 'What is This?',
          text: `This is the help page for a starter App.`
        },
        {
          icon: 'mdi-android',
          title: 'Is this an Android app?',
          text: `This website is designed to work the same across devices. On Android devices, it can
            even be installed as an app, even though it technically isn't one. We are using new
            technology called Progressive Web Applications to accomplish this. So you can use this 
            website on your computer, your tablet, and your phone, as long as you have a web browser.
            It should look and feel like an app.`
        },
        {
          icon: 'mdi-lock',
          title: 'How do you store passwords?',
          text: `We encrypt them before storing them.`
        },
        {
          icon: 'mdi-fingerprint',
          title: 'What is your privacy policy?',
          text: `We should probably make one of those.`
        },
        {
          icon: 'mdi-gavel',
          title: 'Legal Disclaimer',
          text: `I am not a lawyer.`
        }
      ]
    }
  },
  computed: {
    helps() {
      if (this.search === '') {
        return this.helpSource
      }
      let hs = this.helpSource.filter(
        source => source.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      )
      return hs
    }
  },
  mounted() {
    if (this.incomingSearch) {
      this.search = this.incomingSearch
    }
  }
}
</script>

