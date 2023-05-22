<template>
  <img alt="Fables Logo" src="./assets/fables.png" />
  <FablesAlchemy msg="Potion Generator" />
</template>

<script>
import FablesAlchemy from "./components/FablesAlchemy.vue";
import "./stars.js";

export default {
  name: "App",
  components: {
    FablesAlchemy,
  },
};
</script>

<style>
@import "./style.css";

#app {
  font-family: "Recoleta";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #adb0d8ff;
}
</style>
