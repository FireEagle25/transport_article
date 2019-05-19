import Outpost, {CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD} from "./outpost";
import {MAX_PAYLOAD} from "./truck";

export let checked_trucks_at_the_second_outpost = 0;

class SecondOutpost extends Outpost{
  get_check_time(truck_payload) {
    if (Math.floor((Math.random() * 20) + 1 + ((1/(1+Math.exp(-(truck_payload-40)/10))) * 80)) < this.check_probability * 100)
      return 0;

    checked_trucks_at_the_second_outpost++;

    return Math.pow(truck_payload/MAX_PAYLOAD, CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD) * CHECKING_TIME_DEPENDENCY_FROM_PAYLOAD * 1000;
  }
}

export default SecondOutpost;
