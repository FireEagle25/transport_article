import Observable from "../../patterns_and_structures/observable.js";
import {truck_statuses} from "../../models/truck";
import {get_geo_path} from "../geo";
import {orders_storage} from "../main";
import {order_statuses} from "../../models/order";
import {find_nearest_warehouse} from "../logistic";

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
          truck.change_path(get_geo_path(truck.geo, find_nearest_warehouse(truck.geo).geo), find_nearest_warehouse(truck.geo));
          truck.change_status(truck_statuses.moving_to_the_warehouse);
        }

        self.notify_all(truck);

        if (moving_ended) {
          switch (truck.status) {
            case truck_statuses.moving_to_the_outpost:
              self.check_truck_at_outpost(truck);
              break;
            case truck_statuses.moving_to_the_client:
              if (orders_storage[truck.order_id].trucks_at_the_customer_ids.indexOf(truck.id) == -1) {
                orders_storage[truck.order_id].products_count -= truck.products_count;
                orders_storage[truck.order_id].trucks_at_the_customer_ids.push(truck.id);

                if (orders_storage[truck.order_id].products_count == orders_storage[truck.order_id].trucks_at_the_customer_ids.products_count_at_the_customer)
                  orders_storage[truck.order_id].change_status(order_statuses.closed);
                //TODO: удалить все грузовики с заказа
              }
              break;
            default:
              self.remove(truck);
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
      if (orders_storage[truck.order_id].status == order_statuses.active) {

        truck.change_path(get_geo_path(truck.geo, orders_storage[truck.order_id].geo), orders_storage[truck.order_id].customer);
        truck.change_status(truck_statuses.moving_to_the_client);
      }
      else {
        truck.change_path(get_geo_path(truck.geo, find_nearest_warehouse(truck.geo).geo, find_nearest_warehouse(truck.geo)));
        truck.change_status(truck_statuses.moving_to_the_warehouse);
      }
      self.push(truck);
    }, truck.dest.get_check_time(truck.products_count));
  }
}

export default TruckService;
