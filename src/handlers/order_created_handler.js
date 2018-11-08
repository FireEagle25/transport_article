class OrderCreatedHandler {
  constructor(orders_service) {
    this.orders_service = orders_service;
  }

  notify(order) {
    this.orders_service.push(order);
  }
}

export default OrderCreatedHandler;
