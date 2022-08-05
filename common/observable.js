export default class Observable {
  #handlers = [];

  subscribe(handler) {
    this.#handlers.push(handler);

    // Return a function for unsubscribe
    return () => {
      const index = this.#handlers.indexOf(handler);
      if (index > -1) {
        this.#handlers.splice(index, 1);
      }
    };
  }

  emit(event) {
    this.#handlers.forEach((handler) => {
      handler(event);
    });
  }
}
