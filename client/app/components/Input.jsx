import * as React from "react";
import { useState } from "react";
import { sendTextMessage } from "../services/websocket";

export default function Input() {
  const [text, setText] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendTextMessage(text.trim());
      setText("");
    }
  };

  return (
    <section className="section-input flex flex-col" autoFocus>
      <textarea
        rows="5"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyPress={handleKeyPress}
      />
    </section>
  );
}
