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

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ecf0f1;
}

#app {
  min-height: 100vh;
  padding: 20px;
}
</style>