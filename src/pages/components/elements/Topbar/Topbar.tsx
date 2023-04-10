import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Menu from "@sidebar/Nav/MainNav";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4 p-2">
        <p className="text-center text-2xl text-white">
          {sessionData && <span>{sessionData.user?.name}</span>}
        </p>
        <button
          className="text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "(Sign out)" : "Sign in"}
        </button>
      </div>
    </>
  );
};

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SkillName = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  // Extract the skill name from the current path
  const skillName = currentPath.split("/")[2]; // Adjust this according to your routes structure

  return (
    <div className="flex flex-row items-center justify-center gap-4 p-2">
      <p className="text-center text-2xl text-white">{skillName ? capitalizeWords(skillName) : "The Game" }</p>
    </div>
  );
};

const Topbar = () => {
  return (
    <div className="topbar top-0 z-50 w-full bg-gray-800">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-white"></div>
          <div className="font-bold text-white">The Game</div>
        </div>
        <SkillName />
        <AuthShowcase />
      </div>
    </div>
  );
};

export default Topbar;
