export const order_statuses = {
  handle: 0,
  active: 1,
  canceled: 2,
  closed: 3
};

class Order {
  constructor(id, tariff, products_count, customer) {
    this.id = id;
    this.tariff = tariff;
    this.products_count = products_count;
    this.customer = customer;
    this.status = order_statuses.handle;
    this.products_count_at_the_customer = 0;
    this.trucks_at_the_customer_ids = [];
    this.created_at = Date.now();
  }

  change_status(status) {
    this.status = status;
  }
}

export default Order;
