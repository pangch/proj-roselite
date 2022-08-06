import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { sendTextMessage } from "../services/websocket";

export default function Input() {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendTextMessage(text.trim());
      setText("");
    }
  };

  useEffect(() => {
    const delayed = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
    return () => window.clearTimeout(delayed);
  }, []);

  return (
    <section className="section-input flex flex-col" autoFocus>
      <textarea
        rows="3"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
    </section>
  );
}
