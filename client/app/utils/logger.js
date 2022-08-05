let logItemId = 1;
let consoleContextDispatch = null;

export function setConsoleContextDispatch(dispatch) {
  consoleContextDispatch = dispatch;
}

class Logger {
  constructor(tag) {
    this.tag = tag;
  }

  #log(message, level, error = null) {
    level = level ?? "debug";
    if (console[level] == null) {
      level = "info";
    }

    const logMessage = `[${this.tag}] ${message}`;
    console[level](`[${this.tag}] ${message}`);
    if (error != null) {
      console[level](`[${this.tag}] ${error}`);
    }

    if (consoleContextDispatch != null) {
      const id = logItemId++;
      consoleContextDispatch({
        type: "append",
        item: {
          id,
          level,
          time: new Date(),
          message: logMessage,
        },
      });
      if (error != null) {
        consoleContextDispatch({
          type: "append",
          item: {
            id,
            level,
            time: new Date(),
            message: `[${this.tag}] ${error}`,
          },
        });
      }
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
