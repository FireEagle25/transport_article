import directionsClient from '../../node_modules/@mapbox/mapbox-sdk/services/directions';
import GeoPoint from "../../node_modules/geopoint/geopoint.js";
const mbxClient = directionsClient({ accessToken: "pk.eyJ1IjoiZXZlbGVudCIsImEiOiJjaWduZmdydmUwMDF0bHVrdDB3dmtkZHJjIn0.QN3O5fQ44HY2Kg0WAUCCkQ" });

let geo_path_storage = [];

export function get_geo_path(geo_from, geo_to, cb=null) {
  /*
   mapbox api
    See here: https://www.mapbox.com/api-documentation/#directions
  */

  let searching_in_storage_res = find_path_in_storage(geo_from, geo_to);

  if (searching_in_storage_res != null)
    return searching_in_storage_res;
  else
    return get_geo_path_from_mapbox(geo_from, geo_to, cb);
}

function get_geo_path_from_mapbox(geo_from, geo_to, cb) {

  let result = [geo_from];

  let waiting_for_path_waipoints = [];

  for (let i=0; i< 100; i++)
    waiting_for_path_waipoints.push(geo_from);

  /*mbxClient
    .getDirections({
      profile: 'driving',
      waypoints: [
        {
          coordinates: [geo_from.longitude(false), geo_from.latitude(false)],
          approach: 'unrestricted'
        },
        {
          coordinates: [geo_to.longitude(false), geo_to.latitude(false)],
          bearing: [100, 60],
          radiuses: [1,1,1]
        }
      ]
    })
    .send()
    .then(response => {
      const directions = response.body;

      result = directions.waypoints.map( (waypoint) => {
        return new GeoPoint(waypoint.location[1], waypoint.location[0]);
      });

      result.push(geo_to);

      geo_path_storage.push({
        'from': JSON.stringify(geo_from),
        'to': JSON.stringify(geo_to),
        'path': result
      });

      cb(result);
    });*/

  setTimeout(function () {
    cb([geo_from, geo_to]);
  },10);

  return waiting_for_path_waipoints;
}

function find_path_in_storage(geo_from, geo_to) {
  for (let path in geo_path_storage)
    if ((path['from'] == JSON.stringify(geo_from)) && (path['to'] == JSON.stringify(geo_to)))
      return path['path'];

  return null;
}

export function get_distance(geo1, geo2) {
  return geo1.distanceTo(geo2, true);
}
