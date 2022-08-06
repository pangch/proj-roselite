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

  #log(message, level, error = null, ...args) {
    const logMessage = `[${this.tag}] ${message}`;
    console[level](logMessage, ...args);

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
      console[level](error);

      loggerObservable.emit({
        type: "new",
        item: {
          id: currentId++,
          level,
          time: new Date(),
          message: `[${this.tag}] ${error}`,
        },
      });
    }
  }

  debug(message, ...args) {
    this.#log(message, "debug", null, ...args);
  }

  info(message, ...args) {
    this.#log(message, "info", null, ...args);
  }

  warn(message, error, ...args) {
    this.#log(message, "warn", error, ...args);
  }

  error(message, error, ...args) {
    this.#log(message, "error", error, ...args);
  }
}

export function createLogger(tag) {
  return new Logger(tag);
}
