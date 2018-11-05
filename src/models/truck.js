import Geopoint from "./geopoint.js";

export const truck_statuses = {
  moving_to_the_outpost: 1,
  at_the_outpost: 2,
  moving_to_the_client: 3,
  moving_to_the_warehouse: 4
};

export const MAX_PAYLOAD = 100;

/*
TODO: Try to use multi inheritance
Multi inheritance is just my experiment
i know nothing about it at javascript
But I wanna use observable pattern here beside Geopoint model to watching for trucks moves
*/

class Truck extends Geopoint{

  constructor(id, geo, products_count, order_id, path, dest) {
    super(id, geo);

    if (products_count > MAX_PAYLOAD) {
      console.error("Truck products_count >  Truck's MAX_PAYLOAD");
      products_count = MAX_PAYLOAD
    }

    this.products_count = products_count;
    this.dest = dest;
    this.path = path;
    this.status = truck_statuses.moving_to_the_outpost;
    this.order_id = order_id;
  }

  move_to_next_geopoint() {
    if (this.dest.length >= 1) {
      this.geo = this.path[0];
      this.path = this.path.shift();
      return false;
    }
    else
      return true;
  }

  change_path(path, dest) {
    this.geo = path[0];
    this.path = path.shift();
    this.dest = dest;
  }

  change_status(status) {
    this.status = status;
  }
}

export default Truck;
