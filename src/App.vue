<template>
  <div id="app">
    <VehiculosList />
  </div>
</template>

<script>
import VehiculosList from './components/VehiculosList.vue';

export default {
  name: 'App',
  components: {
    VehiculosList
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  background-size: cover;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>