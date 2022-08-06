import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { getWSService } from "../services/websockets";

export default function Input() {
  const [text, setText] = useState("");
  const [hasError, setHasError] = useState(false);

  const inputRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const ws = getWSService();
      if (ws == null) {
        setHasError(true);
        return;
      }
      ws.sendTextMessage(text.trim());
      setText("");
    }
  };

  const handleChange = (event) => {
    setHasError(false);
    setText(event.target.value);
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
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
    </section>
  );
}
