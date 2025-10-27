class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];

    // Avoid adding duplicate callbacks
    if (!this.callbacks[event].includes(cb)) {
      this.callbacks[event].push(cb);
    } else {
      this.callbacks[event][this.callbacks[event].indexOf(cb)] = cb;
    }
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
