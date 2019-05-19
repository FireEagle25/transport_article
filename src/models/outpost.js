import Geopoint from "./geopoint.js";
import {MAX_PAYLOAD} from "./truck";

export const CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD = 20;

export let checked_trucks = 0;

class Outpost extends Geopoint{
  constructor(id, geo, check_probability) {
    super(id, geo);
    //Check probability needs to be from 0 to 100
    this.check_probability = check_probability;
  }

  get_check_time(truck_payload) {
    if (Math.floor((Math.random() * 20) + 1 + ((1/(1+Math.exp(-(truck_payload-40)/10))) * 80)) < this.check_probability * 100)
      return 0;

    checked_trucks++;
    return Math.pow(truck_payload/MAX_PAYLOAD, CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD) * CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD * 1000;
  }
}

export default Outpost;
