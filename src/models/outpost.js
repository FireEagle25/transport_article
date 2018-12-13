import Geopoint from "./geopoint.js";
import {MAX_PAYLOAD} from "./truck";

export const CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD = 2;

class Outpost extends Geopoint{
  constructor(id, geo, check_probability) {
    super(id, geo);
    //Check probability needs to be from 0 to 100
    this.check_probability = check_probability;
  }

  get_check_time(truck_payload) {
    if (Math.floor((Math.random() * 50) + 1 + (truck_payload/MAX_PAYLOAD * 50)) < this.check_probability)
      return 0;

    return Math.pow(truck_payload/MAX_PAYLOAD, CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD) * CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD * 1000;
  }
}

export default Outpost;
