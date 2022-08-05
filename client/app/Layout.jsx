import * as React from "react";

import Title from "./components/Title";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Input from "./components/Input";
import Info from "./components/Info";
import Console from "./components/Console";

export default function Layout() {
  return (
    <div className="flex flex-col grow h-screen">
      <Title />
      <div className="flex grow">
        <Users />
        <div className="flex flex-col grow">
          <Messages />
          <Input />
        </div>
        <div className="flex flex-col grow-0">
          <Info />
        </div>
      </div>
      <Console />
    </div>
  );
}
