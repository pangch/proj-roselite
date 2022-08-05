import * as React from "react";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { useMessagesContext } from "../contexts/MessagesContext";
import { getSessionId } from "../utils/session";
import { getUserNameFromId } from "../utils/users";

function EmptyPlaceholder() {
  return <div>No messages</div>;
}

function StatusMessageItem({ message }) {
  return (
    <li className="message status-message self-center">{message.content}</li>
  );
}

function TextMessageItem({ message, isSelf }) {
  const id = message.userId;
  const username = getUserNameFromId(id);
  return (
    <li
      className={classNames(
        "message",
        "text-message",
        "flex",
        "flex-col",
        isSelf ? ["sent-message"] : ["received-message"]
      )}
    >
      <div className="username">{username}</div>
      <div className="content">{message.content}</div>
    </li>
  );
}

function MessageItem({ message }) {
  const sessionId = getSessionId();

  switch (message.messageType) {
    case "status":
      return <StatusMessageItem message={message} />;
    case "text":
      return (
        <TextMessageItem
          message={message}
          isSelf={message.userId === sessionId}
        />
      );
  }

  return null;
}

function MessageList({ messages }) {
  return (
    <ul className="flex flex-col">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  );
}

export default function Messages() {
  const messages = useMessagesContext();
  const messagesEndRef = useRef(null);

  const count = messages.length;
  useEffect(() => {
    const delayed = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 50);
    return () => window.clearTimeout(delayed);
  }, [count]);

  return (
    <section className="section-messages grow overflow-y-scroll basis-0">
      {isEmpty(messages) ? (
        <EmptyPlaceholder />
      ) : (
        <MessageList messages={messages} />
      )}
      <div ref={messagesEndRef} />
    </section>
  );
}
