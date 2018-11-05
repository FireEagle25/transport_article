export function get_geo_path(geo_from, geo_to) {
  /*TODO: add mapbox api
    See here: https://www.mapbox.com/api-documentation/#directions
  */
  return [geo_from, geo_to];
}

export function get_distance(geo1, geo2) {
  return geo1.distanceTo(geo2, true);
}
