import Truck from "../models/truck";

export let trucks_count = 0;


export function run_truck(order_id, start_factory, products_count, path, dest) {

  const new_truck = new Truck(trucks_count, start_factory.geo, products_count, order_id, path, dest);

  trucks_count++;

  return new_truck;
}

export default run_truck;
