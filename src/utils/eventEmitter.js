class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  emit(event, data) {
    const cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  }

  removeListener(event, callback) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs = cbs.filter((cb) => cb !== callback);
      this.callbacks[event] = cbs;
    }
  }
}

export default EventEmitter;
