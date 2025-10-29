"use client";
import { Search } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "./ui/button"; // Optional: Reuse if needed for other buttons

export function NavBar() {
  const { userId } = useAuth();
  const isLoggedIn = Boolean(userId);
  return (
    <nav className="w-full bg-white px-6 py-3 h-[70px] flex items-center justify-between border border-gray-600/20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-black">✱</span>
          <Link href={'/'}>
            NoteSage
          </Link>
        </div>
        <div className="flex items-center gap-6 text-gray-700 text-sm">
          <Link href="/" className="hover:text-black font-semibold">Home</Link>
          <Link href="/explore" className="hover:text-black font-semibold">Explore</Link>
          <Link href="/mynotes" className="hover:text-black font-semibold">My Notes</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-100 px-3 w-[200px] py-2 rounded-lg text-gray-500">
          <Search size={16} className="mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none border-none w-full text-gray-700 placeholder-gray-500"
          />
        </div>
        {isLoggedIn ? (
          <UserButton />
        ) : (
          <div className="flex gap-2">
            <SignUpButton mode="modal">
              <Button className="inline-block rounded-md border bg-gray-800 px-8 text-sm font-medium text-white hover:bg-transparent focus:ring-1 hover:text-gray-950 focus:outline-none">
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button className="inline-block rounded-md border bg-gray-800 px-8 text-sm font-medium text-white hover:bg-transparent focus:ring-1 hover:text-gray-950 focus:outline-none">
                Sign In
              </Button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}