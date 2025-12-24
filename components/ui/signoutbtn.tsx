"use client";

import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function SignOutBtn() {
  const handleSignOut = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex flex-row justify-center bg-gray-200 text-gray-500 hover:text-white hover:bg-red-300 cursor-pointer py-2 px-4 rounded-lg text-center items-center"
    >
      <LogOut />
    </button>
  );
}
