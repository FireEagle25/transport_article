import Factory from '../models/factory.js';
import Warehouse from '../models/warehouse.js';
import Outpost from '../models/outpost.js';
import Tariff from '../models/tariff.js';
import Customer from '../models/customer.js';
import OrdersService from './realtime_servises/orders_service.js';
import OrderFactory from '../factories/order_factory.js';
import OrderCreatedHandler from '../handlers/order_created_handler.js';
import Info from "../handlers/info.js";
import GeoPoint from "../../node_modules/geopoint/geopoint.js";
import TruckService from "./realtime_servises/truck_service";
import OrderHandler from "../handlers/order_handler";

export let factories_storage = [];
export let warehouses_storage = [];
export let outposts_storage = [];
export let tariffs_storage = [];
export let customers_storage = [];
export let orders_storage = [];

export const truck_service = new TruckService();


function start_app() {

  factories_storage.push(
    new Factory(0, new GeoPoint(55.755826, 37.6173), 13),
    new Factory(1, new GeoPoint(57.8136, 28.3496), 34),
    new Factory(1, new GeoPoint(48.71939, 44.50184), 75));

  warehouses_storage.push(
    new Warehouse(0, new GeoPoint(51.1078852, 17.0385376))
  );

  outposts_storage.push(
    new Outpost(0, new GeoPoint(55.855898,	29.964459), 0.9),
    new Outpost(1, new GeoPoint(56.030129,	28.690065), 0.9),
    new Outpost(2, new GeoPoint(56.080129,	28.278488), 0.9),
    new Outpost(3, new GeoPoint(55.839097,	29.387026), 0.9),
    new Outpost(4, new GeoPoint(55.602565,	30.822907), 0.9),
    new Outpost(5, new GeoPoint(55.458740,	30.908523), 0.9),
    new Outpost(6, new GeoPoint(54.983001,	30.972314), 0.9),
    new Outpost(7, new GeoPoint(54.691507,	30.987881), 0.9),
    new Outpost(8, new GeoPoint(54.599174,	31.180496), 0.9),
    new Outpost(9, new GeoPoint(54.058487,	31.885151), 0.9),
    new Outpost(10, new GeoPoint(53.773852,	32.286388), 0.9),
    new Outpost(11, new GeoPoint(53.293477,	32.580795), 0.9),
    new Outpost(12, new GeoPoint(52.440510,	31.604496), 0.9),
    new Outpost(13, new GeoPoint(52.366600,	33.238169), 0.9),
    new Outpost(14, new GeoPoint(51.872128,	34.323022), 0.9),
    new Outpost(15, new GeoPoint(51.654727,	34.114326), 0.9),
    new Outpost(16, new GeoPoint(50.297031,	36.283095), 0.9),
    new Outpost(17, new GeoPoint(48.291290,	39.906557), 0.9),
    new Outpost(18, new GeoPoint(51.172600,	23.805953), 0.9),
    new Outpost(19, new GeoPoint(50.277286,	23.559936), 0.9),
    new Outpost(20, new GeoPoint(49.947370,	23.139281), 0.9),
    new Outpost(21, new GeoPoint(52.070867,	23.628843), 0.9),
    new Outpost(22, new GeoPoint(53.527341,	23.666350), 0.9),
    new Outpost(23, new GeoPoint(51.186770,	14.990135), 0.9),
    new Outpost(24, new GeoPoint(51.668004,	14.745794), 0.9),
    new Outpost(25, new GeoPoint(52.316064,	14.566756), 0.9),
    new Outpost(26, new GeoPoint(53.341597,	14.392963), 0.9),
    new Outpost(27, new GeoPoint(49.758288,	18.607271), 0.9),
    new Outpost(28, new GeoPoint(49.938895,	18.422414), 0.9),
    new Outpost(29, new GeoPoint(50.873033,	15.640566), 0.9));


//Needed in priority > 0 for next order cancel rules
  tariffs_storage.push(
    new Tariff(0, 100, 1),
    new Tariff(1, 150, 2));


  customers_storage.push(
    new Customer(0, new GeoPoint(54.35205, 18.64637)),
    new Customer(1, new GeoPoint(52.52437, 13.41053)),
    new Customer(2, new GeoPoint(50.08804, 14.42076)),
    new Customer(3, new GeoPoint(52.22977, 21.01178)),
    new Customer(4, new GeoPoint(51.05089, 13.73832)),
    new Customer(5, new GeoPoint(54.35205, 18.64637)));

  const orders_service = new OrdersService();
  const order_factory = new OrderFactory();

  order_factory.subscribe(new OrderCreatedHandler(orders_service));
  orders_service.subscribe(new OrderHandler(truck_service));
}



export default start_app;


new Factory(12, new GeoPoint(52.440510,	31.604496), 50)
