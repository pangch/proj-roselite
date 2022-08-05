let logItemId = 1;
let consoleContextDispatch = null;

export function setConsoleContextDispatch(dispatch) {
  consoleContextDispatch = dispatch;
}

export default function logger(message, level) {
  level = level ?? "debug";
  if (console[level] == null) {
    level = "info";
  }
  console[level](message);

  if (consoleContextDispatch != null) {
    const id = logItemId++;
    consoleContextDispatch({
      type: "append",
      item: {
        id,
        level: level ?? "debug",
        time: new Date(),
        message,
      },
    });
  }
}
