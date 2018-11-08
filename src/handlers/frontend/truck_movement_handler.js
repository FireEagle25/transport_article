class TruckMovementHandler {
  constructor(component) {
    this.component = component;
  }

  handle(truck) {
    this.component.move_truck(truck);
  }
}
