import Geopoint from "./geopoint.js";
import {MAX_PAYLOAD} from "./truck.js";

class Factory extends Geopoint{
  constructor(id, geo, max_truck_payload) {
    super(id, geo);

    if (max_truck_payload > MAX_PAYLOAD)
      max_truck_payload = MAX_PAYLOAD;

    this.max_truck_payload = max_truck_payload;
  }
}

export default Factory;
