import * as React from "react";
import { useEffect, useRef } from "react";
import classNames from "classnames";

import { useConsoleContext } from "../contexts/ConsoleContext";

const dateTimeFormat = new Intl.DateTimeFormat("en");

function ConsoleItem({ item }) {
  return (
    <div className={classNames("console-item", "flex", item.level)}>
      <div className="time shrink-0">{item?.time?.toISOString()}</div>
      <div className="grow">{item?.message}</div>
    </div>
  );
}

export default function Console() {
  const consoleState = useConsoleContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleState]);

  return (
    <section className="section-console grow-0">
      {consoleState?.map((item) => (
        <ConsoleItem key={item.id} item={item} />
      ))}
      <div ref={messagesEndRef} />
    </section>
  );
}
