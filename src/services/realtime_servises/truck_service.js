import Observable from "../../patterns_and_structures/observable.js";
import {truck_statuses} from "../../models/truck";
import {get_distance, get_geo_path} from "../geo";
import {increment_success, increment_unsuccess, orders_storage, total_success, total_unsuccess} from "../main";
import {order_statuses} from "../../models/order";
import {find_nearest_warehouse, find_nearest_second_outpost} from "../logistic";

const MOVE_INTERVAL = 1000;


class TruckService extends Observable{
  constructor(autostart=true) {
    super();
    this.trucks = [];

    if (autostart)
      this.move();
  }

  push(truck) {
    this.trucks.push(truck);
    this.notify_all(truck);
  }

  remove(truck) {
    this.trucks.splice(this.trucks.indexOf(truck), 1);
  }

  move() {
    let self = this;
    setInterval(function () {
      self.trucks.map(truck => {
        const moving_ended = truck.move_to_next_geopoint();

        if (truck.status == truck_statuses.moving_to_the_client && orders_storage[truck.order_id].status == order_statuses.canceled) {
          truck.change_path(get_geo_path(truck.geo, find_nearest_warehouse(truck.geo).geo, truck.change_path), find_nearest_warehouse(truck.geo));
          truck.change_status(truck_statuses.moving_to_the_warehouse);
        }

        self.notify_all(truck);

        if (moving_ended) {
          switch (truck.status) {
            case truck_statuses.moving_to_the_outpost:
              self.check_truck_at_outpost(truck);
              break;
            case truck_statuses.moving_to_the_second_outpost:
              self.check_truck_at_second_outpost(truck);
              break;
            case truck_statuses.moving_to_the_client:
              if (orders_storage[truck.order_id].trucks_at_the_customer_ids.indexOf(truck.id) == -1) {
                orders_storage[truck.order_id].products_count -= truck.products_count;
                orders_storage[truck.order_id].trucks_at_the_customer_ids.push(truck.id);
                orders_storage[truck.order_id].change_status(order_statuses.closed);
              }
              break;
          }
        }

      });
    }, MOVE_INTERVAL);

  }

  check_truck_at_outpost(truck) {
    let self = this;

    truck.change_status(truck_statuses.at_the_outpost);
    self.remove(truck);

    setTimeout(function () {
      let nearest_second_outpost = find_nearest_second_outpost(truck.geo);
      truck.change_path(get_geo_path(truck.geo, nearest_second_outpost.geo, (path) => {truck.change_path(path);}), nearest_second_outpost);
      truck.change_status(truck_statuses.moving_to_the_second_outpost);
      truck.distance += get_distance(nearest_second_outpost.geo, truck.geo);
      self.push(truck);
    }, truck.dest.get_check_time(truck.products_count));
  }

  check_truck_at_second_outpost(truck) {
    truck.dest = find_nearest_second_outpost(truck.geo);
    let self = this;

    truck.change_status(truck_statuses.at_the_second_outpost);
    self.remove(truck);

    setTimeout(function () {
      if (orders_storage[truck.order_id].status == order_statuses.active) {
        truck.change_path(get_geo_path(truck.geo, orders_storage[truck.order_id].customer.geo, (path) => {truck.change_path(path);}), orders_storage[truck.order_id].customer);

        truck.distance += get_distance(orders_storage[truck.order_id].customer.geo, truck.geo);

        increment_success(truck.distance * orders_storage[truck.order_id].tariff.price_for_km * truck.products_count/5000);

        truck.change_status(truck_statuses.moving_to_the_client);
      }
      else {
        let warehouse = find_nearest_warehouse(truck.geo);

        truck.distance += get_distance(warehouse.geo, truck.geo);
        increment_unsuccess(truck.distance / 4);

        truck.change_path(get_geo_path(truck.geo, warehouse.geo, (path) => {truck.change_path(path);}));
        truck.change_status(truck_statuses.moving_to_the_warehouse);
      }
      self.push(truck);
    }, truck.dest.get_check_time(truck.products_count));
  }
}

export default TruckService;
