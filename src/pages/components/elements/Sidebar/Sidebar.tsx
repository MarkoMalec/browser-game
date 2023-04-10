import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link.js";
import MainNav from "@sidebar/Nav/MainNav";
const gameName = "The Game";

const Sidebar = (layout: object) => {
  return (
    <aside className="sidebar ml-2 rounded-xl border-slate-700 bg-slate-800 p-4">
      <Link href="/">
        <h1 className="border-b border-slate-700 p-3 text-center text-2xl font-bold text-white">
          {gameName}
        </h1>
      </Link>
      <MainNav />
    </aside>
  );
};

export default Sidebar;
