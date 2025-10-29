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
    <nav className="w-full bg-white/95 backdrop-blur-sm px-6 py-4 h-[70px] flex items-center justify-between border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">✱</span>
          </div>
          <Link href={'/'} className="text-gray-900 hover:text-blue-600 transition-colors">
            NoteSage
          </Link>
        </div>
        <div className="flex items-center gap-6 text-gray-600 text-sm">
          <Link href="/" className="hover:text-blue-600 font-semibold transition-colors">Home</Link>
          <Link href="/explore" className="hover:text-blue-600 font-semibold transition-colors">Explore</Link>
          <Link href="/mynotes" className="hover:text-blue-600 font-semibold transition-colors">My Notes</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-50 px-4 w-[250px] py-2 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
          <Search size={18} className="mr-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes and posts..."
            className="bg-transparent outline-none border-none w-full text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>
        {isLoggedIn ? (
          <UserButton />
        ) : (
          <div className="flex gap-3">
            <SignUpButton mode="modal">
              <Button className="inline-block rounded-xl border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-md">
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign In
              </Button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}