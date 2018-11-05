class Info {
  constructor(message) {
    this.message = message;
  }
  notify(object) {
    console.log(this.message, object);
  }
}

export default Info;
