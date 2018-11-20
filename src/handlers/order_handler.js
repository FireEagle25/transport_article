import {order_statuses} from "../models/order.js";
import {find_nearest_factory_for_customer, find_nearest_outpost, get_initial_way} from "../services/logistic";
import run_truck from "../factories/truck_factory";
import {orders_storage} from "../services/main";

const TRUCK_GENERATION_INTERVAL = 500;

class OrderHandler {
  constructor(truck_service) {
    this.truck_service = truck_service;
  }

  notify(order) {
    if (order.status !== order_statuses.handle)
      return;

    const start_factory = find_nearest_factory_for_customer(order.customer.geo);

    let truck_payloads = this.get_trucks_payloads(order.products_count, start_factory.max_truck_payload);
    let initial_way = get_initial_way(start_factory.geo);

    let self = this;

    let truck_generation = setInterval(function () {
      orders_storage[order.id].change_status(order_statuses.active);

      if (initial_way.length == 0)
        console.log(start_factory, order, truck_payloads, initial_way[0]);

      const truck = run_truck(order.id, start_factory, truck_payloads.shift(), initial_way, find_nearest_outpost(initial_way[0]));
      self.truck_service.push(truck);

      if (truck_payloads.length == 0)
        clearInterval(truck_generation);

    }, TRUCK_GENERATION_INTERVAL);
  }

  get_trucks_payloads(order_products_count, max_truck_payload) {
    let trucks_products_count = [];

    for(let i = 0; i < Math.floor(order_products_count / max_truck_payload); i++)
      trucks_products_count.push(max_truck_payload);

    const last_truck_payload = order_products_count % max_truck_payload;

    if (last_truck_payload != 0)
      trucks_products_count.push(last_truck_payload);

    return trucks_products_count;
  }
}

export default OrderHandler;
