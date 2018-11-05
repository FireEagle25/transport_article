class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    //Observer need in notify method
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    let index = this.observers.indexOf(observer);
    if (index > -1)
      this.observers.slice(index, 1);
  }

  notify_all(object) {
    for (let o of this.observers)
      o.notify(object);
  }
}

export default Observable;
