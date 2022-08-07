import * as React from "react";

import Title from "./components/Title";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Input from "./components/Input";
import Info from "./components/Info";
import Console from "./components/Console";
import RemoteVideos from "./components/RemoteMedia";
import LocalMedia from "./components/LocalMedia";

export default function Layout() {
  return (
    <div className="flex flex-col grow h-screen">
      <Title />
      <div className="flex grow">
        <div className="flex flex-col basis-1/4 shrink-0">
          <Users />
        </div>
        <div className="flex flex-col grow">
          <RemoteVideos />
          <Messages />
          <Input />
        </div>
        <div className="flex flex-col grow-0 shrink-0">
          <LocalMedia />
          <Info />
        </div>
      </div>
      <Console />
    </div>
  );
}
