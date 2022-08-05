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
  const consoleMessages = useConsoleContext();
  const messagesEndRef = useRef(null);

  const count = consoleMessages.length;
  useEffect(() => {
    const delayed = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 200);
    return () => window.clearTimeout(delayed);
  }, [count]);

  return (
    <section className="section-console grow-0">
      {consoleMessages?.map((item) => (
        <ConsoleItem key={item.id} item={item} />
      ))}
      <div ref={messagesEndRef} />
    </section>
  );
}
