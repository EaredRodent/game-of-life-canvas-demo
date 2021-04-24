<template>
  <v-app>
    <nuxt />
  </v-app>
</template>

<script>
export default {
  name: 'Default'
}
</script>

<style>
html {
  font-size: 14px;
  overflow-y: auto !important;
  font-family: Roboto, monospace;
}

.v-label {
  font-size: 1rem !important;
}

html, body, #__nuxt, #__layout, #app, .v-application--wrap {
  height: 100% !important;
}

.v-application--wrap {
  background: #fff;
}
</style>
