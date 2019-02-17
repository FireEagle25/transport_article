import Geopoint from "./geopoint.js";
import {get_distance} from "../services/geo";

export const truck_statuses = {
  moving_to_the_outpost: 8889,
  at_the_outpost: 2,
  moving_to_the_client: 42,
  moving_to_the_warehouse: 4,
  moving_to_the_second_outpost: 8887,
  at_the_second_outpost: 3
};

export const MAX_PAYLOAD = 100;

class Truck extends Geopoint{

  constructor(id, geo, products_count, order_id, path, dest) {
    super(id, geo);

    this.status = truck_statuses.moving_to_the_outpost;

    if (products_count > MAX_PAYLOAD) {
      console.error("Truck products_count >  Truck's MAX_PAYLOAD");
      products_count = MAX_PAYLOAD
    }

    this.products_count = products_count;
    this.dest = dest;
    this.path = path;
    this.order_id = order_id;
    this.distance = get_distance(geo, dest.geo);
  }

  move_to_next_geopoint() {
    if (this.path.length > 0) {
      this.geo = this.path[0];
      this.path.shift();
      return false;
    }
    else
      return true;
  }

  change_path(path, dest) {
    this.path = path;
    this.dest = dest;
  }

  change_status(status) {
    this.status = status;
  }
}

export default Truck;
