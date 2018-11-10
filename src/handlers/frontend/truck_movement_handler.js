class TruckMovementHandler {
  constructor(component) {
    this.component = component;
  }

  notify(truck) {
    this.component.move_truck(truck);
  }
}

export default TruckMovementHandler;
