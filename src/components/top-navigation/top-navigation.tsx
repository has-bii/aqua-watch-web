import React from "react";
import Logo from "../logo";
import Navigation from "./navigation";
import UserData from "../auth/user-data";

export default function TopNavigation() {
  return (
    <nav className="flex h-16 w-full border-b">
      <div className="container mx-auto my-auto flex items-center justify-between">
        <Logo />

        <Navigation />

        <UserData />
      </div>
    </nav>
  );
}
