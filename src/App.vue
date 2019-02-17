<template>
  <div id="app">

    <div id="trucks-map" style="width:70vw; height: 100vh;"></div>

    <div id="sidebar">

      <H2>Статистика</H2>

      <br />

      <p><b>Грузовиков доехало до клиентов:</b> {{Math.floor(trucks_at_the_client_count / all_trucks_count * 100)}}%</p>
      <p><b>Грузовиков не доехало:</b> {{Math.floor(trucks_at_the_client_count * -1 / all_trucks_count * 100 + 100)}}%</p>
      <p><b>Проверено на первой границе:</b> {{Math.floor(checked_at_outposts / all_trucks_count * 100)}}%</p>
      <p><b>Проверено на второй границе:</b> {{Math.floor(checked_at_the_second_outpost / all_trucks_count * 100)}}%</p>
      <p><b>Прибыль:</b> {{success}}</p>
      <p><b>Убытки:</b> {{unsuccess}}</p>
      <p><b>Чистая прибыль:</b> {{success - unsuccess}}</p>
    </div>

  </div>
</template>

<script>
  import {
    truck_service,
    factories_storage,
    outposts_storage,
    warehouses_storage,
    customers_storage,
    second_outposts_storage, total_success, total_unsuccess
  } from "./services/main";
  import TruckMovementHandler from "./handlers/frontend/truck_movement_handler";
  import {truck_statuses} from './models/truck';
  import {trucks_count} from "./factories/truck_factory";
  import {checked_trucks_at_the_second_outpost} from "./models/second_outpost";
  import {checked_trucks} from "./models/outpost";

  export default {
    name: 'App',
    data() {
      return {
        trucks_at_the_client_count: 0,
        trucks_at_the_warehouse_count: 0,
        all_trucks_count: 0,
        checked_at_outposts: 0,
        checked_at_the_second_outpost: 0,
        success: 0,
        unsuccess: 0
      }
    },
    methods: {
      set_parameters_for_showing: function() {
        this.trucks_at_the_client_count = truck_service.trucks.filter(truck => truck.status == truck_statuses.moving_to_the_client).length;
        this.all_trucks_count = trucks_count;
        this.checked_at_the_second_outpost = checked_trucks_at_the_second_outpost;
        this.checked_at_outposts = checked_trucks;

        this.success = total_success;
        this.unsuccess= total_unsuccess;
      },
      getActualData: function () {
        truck_service.subscribe(new TruckMovementHandler(this));
      },
      move_truck: function (truck) {
        if (!this.markers[truck.id]) {
          this.markers[truck.id] = L.marker([truck.geo._degLat, truck.geo._degLon], {icon: this.truckIcon});
          this.markers[truck.id].bindTooltip("Грузовик " + truck.id).openTooltip();
          this.markers[truck.id].addTo(this.map);
        } else {
          this.markers[truck.id].targetLatLng = {lat: truck.geo._degLat, lng: truck.geo._degLon};
        }
      }
    },
    mounted() {
      console.log("mounted");

      this.getActualData();

      this.markers = [];
      this.map = L.map('trucks-map').setView([51.1078852, 17.0385376], 5);

      this.truckIcon = L.icon({
        iconUrl: 'http://aux2.iconspalace.com/uploads/truck-icon-256-1204409192.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });

      this.factoryIcon = L.icon({
        iconUrl: 'https://png.pngtree.com/svg/20161022/factory__1175357.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });

      this.warehouseIcon = L.icon({
        iconUrl: 'https://image.flaticon.com/icons/png/128/407/407826.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });

      this.outpostIcon = L.icon({
        iconUrl: 'https://maxcdn.icons8.com/office/PNG/512/Travel/customs-512.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });

      this.customerIcon = L.icon({
        iconUrl: 'https://png.pngtree.com/svg/20170719/customer_276528.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [-3, -76]
      });


      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 18
      }).addTo(this.map);

      for (var obj in factories_storage) {
        var geo = factories_storage[obj].geo;
        L.marker([geo._degLat, geo._degLon], {icon: this.factoryIcon}).addTo(this.map);
      }

      for (var obj in warehouses_storage) {
        var geo = warehouses_storage[obj].geo;
        L.marker([geo._degLat, geo._degLon], {icon: this.warehouseIcon}).addTo(this.map);
      }

      for (var obj in outposts_storage) {
        var geo = outposts_storage[obj].geo;
        L.marker([geo._degLat, geo._degLon], {icon: this.outpostIcon}).addTo(this.map);
      }

      for (var obj in second_outposts_storage) {
        var geo = second_outposts_storage[obj].geo;
        L.marker([geo._degLat, geo._degLon], {icon: this.outpostIcon}).addTo(this.map);
      }

      for (var obj in customers_storage) {
        var geo = customers_storage[obj].geo;
        L.marker([geo._degLat, geo._degLon], {icon: this.customerIcon}).addTo(this.map);
      }

      setInterval(this.set_parameters_for_showing, 1000);

      var self = this;

      var lerpingInterval = setInterval(
        function () {
          for (var key in self.markers) {

            var currentLatLng = self.markers[key].getLatLng();

            var targetPosition = self.markers[key].targetLatLng;

            if (!targetPosition)
              return;

            self.markers[key].setLatLng([lerp(currentLatLng.lat, targetPosition.lat),
              lerp(currentLatLng.lng, targetPosition.lng)]);
          }
        },
        10
      );

      function lerp(from, to) {
        return from+((to-from)/100);
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
