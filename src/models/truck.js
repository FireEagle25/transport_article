import Geopoint from "./geopoint.js";

export const truck_statuses = {
  moving_to_the_outpost: 8889,
  at_the_outpost: 2,
  moving_to_the_client: 42,
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

    this.status = truck_statuses.moving_to_the_outpost;

    console.log(this, "status set in constructor " + this.status);

    if (products_count > MAX_PAYLOAD) {
      console.error("Truck products_count >  Truck's MAX_PAYLOAD");
      products_count = MAX_PAYLOAD
    }

    this.products_count = products_count;
    this.dest = dest;
    this.path = path;
    this.order_id = order_id;
  }

  move_to_next_geopoint() {
    console.log('Двигаемся', this, this.path[0], this.path[1]);
    if (this.path.length > 0) {
      this.geo = this.path[0];
      this.path.shift();
      console.log(this, 'передвинулись', this.geo);
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
    console.log(this, "status set in change_status " + this.status, this.dest);
    this.status = status;
  }
}

export default Truck;
