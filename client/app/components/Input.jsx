import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { isEmpty } from "lodash";
import { getMessagesModel } from "../models/messages-model";

export default function Input() {
  const [text, setText] = useState("");
  const [hasError, setHasError] = useState(false);

  const inputRef = useRef(null);

  const handleSend = () => {
    if (isEmpty(text)) {
      setText("");
      return;
    }
    const model = getMessagesModel();
    if (!model.sendTextMessage(text)) {
      setHasError(true);
    } else {
      setText("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
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
    <section className="section-input flex" autoFocus>
      <textarea
        className="grow"
        rows="3"
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
      <span className="icon-button grow-0" onClick={handleSend}>
        <i className="fa fa-send" />
        <span>Send</span>
      </span>
    </section>
  );
}
