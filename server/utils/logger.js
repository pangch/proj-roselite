class Logger {
  constructor(tag) {
    this.tag = tag;
  }

  #log(message, level, error = null) {
    console[level](`[${this.tag}] ${message}`);
    if (error != null) {
      console[level](`[${this.tag}] ${error}`);
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
