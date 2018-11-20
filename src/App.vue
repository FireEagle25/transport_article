<template>
  <div id="app">

    <div id="trucks-map" style="width:70vw; height: 100vh;"></div>

    <div id="sidebar">

      <H2>Статистика</H2>

      <br />

      <p><b>Параметр 1:</b> содержимое</p>
      <p><b>Параметр 2:</b> содержимое</p>
      <p><b>Параметр 3:</b> содержимое</p>
      <p><b>Параметр 4:</b> содержимое</p>

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

      },
      move_truck: function (truck) {
        if (!this.markers[truck.id]) {
          this.markers[truck.id] = L.marker([truck.geo._degLat, truck.geo._degLon], {icon: this.truckIcon});
          this.markers[truck.id].bindTooltip("Грузовик " + truck.id).openTooltip();
          this.markers[truck.id].addTo(this.map);
        } else {
          this.markersActualPosition[truck.id] = {lat: truck.geo._degLat, lng: truck.geo._degLon};
        }
      }
    },
    mounted() {
      console.log("mounted");

      this.getActualData();

      this.markers = [];
      this.markersActualPosition = [];
      this.map = L.map('trucks-map').setView([40.689604, -74.04455], 14);

      this.truckIcon = L.icon({
        iconUrl: 'http://aux2.iconspalace.com/uploads/truck-icon-256-1204409192.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 18
      }).addTo(this.map);

      var lerpingInterval = setInterval(
        function () {
          for (var key in this.markers) {
            var currentLatLng = this.markers[key].getLatLng();
            var targetPosition = this.markersActualPosition[key];

            if (!targetPosition)
              return;

            this.markers[key].setLatLng([lerp(currentLatLng.lat, targetPosition.lat),
              lerp(currentLatLng.lng, targetPosition.lng)]);
          }
        },
        50
      );

      function lerp(from, to) {
        return from+((to-from)/20);
      }

    }
  }

</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

  #sidebar {
    position: absolute;
    width: calc(30vw - 30px);
    height: calc(100vh - 30px);
    right: 0;
    top: 0;
    padding: 15px;
    background: #ffffff;
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
    z-index: 9999;
  }
</style>
