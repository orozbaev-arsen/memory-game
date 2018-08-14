<template lang="pug">
  div#app
    router-view(v-if="is_connected")
    div.app__connection(v-else) Подключение к серверу...
</template>

<script>
export default {
  name: 'App',
  computed: {
    is_connected() {
      return this.$store.state.connected;
    },
  },
};
</script>

<style>
html, body
{
  height: 100vh;
  overflow: auto;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
}
.app__connection {
  max-width: 580px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
