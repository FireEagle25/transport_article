import {get_distance, get_geo_path} from "./geo";
import {factories_storage, outposts_storage, second_outposts_storage, warehouses_storage} from "./main";

const MAX_DISTANCE_BETWEEN_GEOPOINTS_IN_THE_WORLD_IN_KM = 21000;

export function find_nearest_factory_for_customer(geopoint) {
  const nearest_outpost = find_nearest_outpost(geopoint);

  return find_nearest_factory(nearest_outpost.geo);
}

export function get_initial_way(start_geopoint, cb) {
  const nearest_outpost = find_nearest_outpost(start_geopoint);
  return get_geo_path(start_geopoint, nearest_outpost.geo, cb);
}

export function find_nearest_factory(geopoint) {

  let min = 0;
  let max = Math.floor(factories_storage.length);
  return factories_storage[Math.floor(Math.random() * (max - min)) + min];
  //return find_nearest_from_objects(geopoint, factories_storage);
}

export function find_nearest_outpost(geopoint) {
  return find_nearest_from_objects(geopoint, outposts_storage);
}

export function find_nearest_second_outpost(geopoint) {
  return find_nearest_from_objects(geopoint, second_outposts_storage);
}

export function find_nearest_warehouse(geopoint) {
  return find_nearest_from_objects(geopoint, warehouses_storage);
}

function find_nearest_from_objects(geopoint, objects) {
  let nearest_object = null;
  let min_distance_between_geopoint_and_object = MAX_DISTANCE_BETWEEN_GEOPOINTS_IN_THE_WORLD_IN_KM;

  objects.map(object => {
    const distance_between_object_and_geopoint = get_distance(geopoint, object.geo);

    if (distance_between_object_and_geopoint < min_distance_between_geopoint_and_object && (object != undefined)) {
      min_distance_between_geopoint_and_object = distance_between_object_and_geopoint;
      nearest_object = object;
    }
  });

  return nearest_object;
}
