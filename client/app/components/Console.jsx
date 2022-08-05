import * as React from "react";
import { useEffect, useRef } from "react";
import classNames from "classnames";

import { useConsoleContext } from "../contexts/ConsoleContext";

function ConsoleItem({ item }) {
  return (
    <div className={classNames("console-item", "flex", item.level)}>
      <div className="time shrink-0">{item?.time?.toISOString()}</div>
      <div>{`[${item?.level}]`}</div>
      <div className="grow">{item?.message}</div>
    </div>
  );
}

export default function Console() {
  const consoleMessages = useConsoleContext();
  const scrollAreaRef = useRef(null);

  const count = consoleMessages.length;
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [count]);

  return (
    <section
      className="section-console grow-0 overflow-y-scroll"
      ref={scrollAreaRef}
    >
      {consoleMessages?.map((item) => (
        <ConsoleItem key={item.id} item={item} />
      ))}
    </section>
  );
}
