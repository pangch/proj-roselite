import * as React from "react";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { useMessagesContext } from "../contexts/MessagesContext";
import { getSessionId } from "../models/session";
import { useUserNameFromId } from "../contexts/UsersContext";

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
  const username = useUserNameFromId(id);

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
      <pre className="content">{message.content}</pre>
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
  const scrollAreaRef = useRef(null);

  const count = messages.length;
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [count]);

  return (
    <section
      className="section-messages grow overflow-y-scroll basis-0"
      ref={scrollAreaRef}
    >
      {isEmpty(messages) ? (
        <EmptyPlaceholder />
      ) : (
        <MessageList messages={messages} />
      )}
    </section>
  );
}
