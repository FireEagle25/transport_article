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
    new Factory(0, new GeoPoint(40.689604, -74.04455), 13),
    new Factory(1, new GeoPoint(40.689604, -74.04455), 34),
    new Factory(2, new GeoPoint(40.689604, -74.04455), 30));

  warehouses_storage.push(
    new Warehouse(0, new GeoPoint(40.689604, -74.04455)),
    new Warehouse(1, new GeoPoint(40.689604, -74.04455)),
    new Warehouse(2, new GeoPoint(40.689604, -74.04455)));

  outposts_storage.push(
    new Outpost(1, new GeoPoint(40.689604, -74.04455), 0.9),
    new Outpost(2, new GeoPoint(40.689604, -74.04455), 0.9));


//Needed in priority > 0 for next order cancel rules
  tariffs_storage.push(
    new Tariff(0, 100, 1),
    new Tariff(1, 150, 2));


  customers_storage.push(
    new Customer(0, new GeoPoint(40.689604, -74.04455)),
    new Customer(1, new GeoPoint(40.689604, -74.04455)));

  const orders_service = new OrdersService();
  const order_factory = new OrderFactory();

  order_factory.subscribe(new OrderCreatedHandler(orders_service));
  //order_factory.subscribe(new Info('Заказ создан'));
  orders_service.subscribe(new OrderHandler(truck_service));
  //truck_service.subscribe(new Info('Грузовик приехал куда-то'));


}



export default start_app;
