import Observable from "../patterns_and_structures/observable.js";
import Order from '../models/order.js';
import {customers_storage, orders_storage, tariffs_storage} from "../services/main";

const MAX_PRODUCTS_COUNT_PER_ORDER = 100;
const RANDOM_NUMBER_FOR_ORDER_CREATION = 1;
const ORDER_GENERATION_FREQUENCY = 1;
export const ORDER_GENERATION_TIME = 1000;

class OrderFactory extends Observable{

  constructor(autostart=true) {
    super();

    if (autostart)
      this.start_production();
  }

  start_production() {
    const self = this;

    const interval = setInterval(function () {


      //TODO: убрать стоп

      if (orders_storage.length > 3)
        clearInterval(interval);

      for (const customer of customers_storage) {
        if (Math.floor((Math.random() * ORDER_GENERATION_FREQUENCY) + 1) == RANDOM_NUMBER_FOR_ORDER_CREATION) {
          const new_order = new Order(orders_storage.length, tariffs_storage[Math.floor(Math.random() * tariffs_storage.length)], Math.floor(Math.random() * MAX_PRODUCTS_COUNT_PER_ORDER), customer);

          self.notify_all(new_order);
          orders_storage.push(new_order);
        }
      }
    }, ORDER_GENERATION_TIME);
  }
}

export default OrderFactory;
