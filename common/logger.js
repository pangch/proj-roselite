import Observable from "./observable.js";

const loggerObservable = new Observable();

let currentId = 0;

export function subscribeLogger(handler) {
  return loggerObservable.subscribe(handler);
}

class Logger {
  constructor(tag) {
    this.tag = tag;
  }

  #log(message, level, error = null) {
    const logMessage = `[${this.tag}] ${message}`;
    console[level](logMessage);

    loggerObservable.emit({
      type: "new",
      item: {
        id: currentId++,
        level,
        time: new Date(),
        message: logMessage,
      },
    });

    if (error != null) {
      const errorMessage = `[${this.tag}][Error] ${error}`;
      console[level](`[${this.tag}][Error] ${error}`);

      loggerObservable.emit({
        type: "new",
        item: {
          id: currentId++,
          level,
          time: new Date(),
          message: errorMessage,
        },
      });
    }
  }

  debug(message) {
    this.#log(message, "debug");
  }

  info(message) {
    this.#log(message, "info");
  }

  warn(message, error) {
    this.#log(message, "warn", error);
  }

  error(message, error) {
    this.#log(message, "error", error);
  }
}

export function createLogger(tag) {
  return new Logger(tag);
}
