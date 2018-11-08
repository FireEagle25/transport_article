<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>

    <div id="hyj">

    </div>
  </div>
</template>

<script>
  import {truck_service} from "./services/main";
  import TruckMovementHandler from "./handlers/frontend/truck_movement_handler";

  export default {
    name: 'App',
    methods: {
      getActualData: function () {
        truck_service.subscribe(new TruckMovementHandler(this));
      }
    },
    beforeMount() {
      this.getActualData();
    }
  }

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
