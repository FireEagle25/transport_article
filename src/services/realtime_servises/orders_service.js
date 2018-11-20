import Observable from "../../patterns_and_structures/observable.js";
import PriorityQueue from "../../patterns_and_structures/priority_queue.js";
import {order_statuses} from "../../models/order";
import {orders_storage} from "../main";

export const ORDER_HANDLE_TIME = 1 ; //ORDER_GENERATION_TIME;
const CANCEL_TIME_IN_SECONDS = 10;


class OrdersService extends Observable{
  constructor(autostart=true, auto_canceling=true) {
    super();
    this.priority_queue = new PriorityQueue();

    if (autostart)
      this.handle_orders();

    if (auto_canceling)
      this.cancel_orders();
  }

  push(object) {
    this.priority_queue.push(object, object.tariff.priority)
  }

  handle_orders() {
    let self = this;

    setInterval(function () {
      const order = self.priority_queue.pop();

      if (order != null)
        self.notify_all(order);

    }, ORDER_HANDLE_TIME);
  }


  cancel_orders() {
    let self = this;

    setInterval(function () {
      orders_storage.map(order => {
        if ((order.status != order_statuses.canceled && order.status != order_statuses.closed) && Math.floor((Date.now() - order.created_at) / 1000) >= CANCEL_TIME_IN_SECONDS) {
          if (Math.floor((Math.random() * 10 / order.tariff.priority)) == 0) {
            order.change_status(order_statuses.canceled);
            console.log("Отменили");
            //TODO: донастроить
          }
        }

      });
    }, 1000);
  }
}

export default OrdersService;
