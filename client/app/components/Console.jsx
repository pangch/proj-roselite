import * as React from "react";
import classNames from "classnames";

import { useConsoleContext } from "../contexts/ConsoleContext";

const dateTimeFormat = new Intl.DateTimeFormat("en");

function ConsoleItem({ item }) {
  return (
    <div className={classNames("console-item", "flex", item.level)}>
      <div className="time">{item?.time?.toISOString()}</div>
      <div className="grow">{item?.message}</div>
    </div>
  );
}

export default function Console() {
  const consoleState = useConsoleContext();
  return (
    <section className="section-console">
      {consoleState?.map((item) => (
        <ConsoleItem key={item.id} item={item} />
      ))}
    </section>
  );
}
