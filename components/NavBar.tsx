"use client"
import Image from "next/image";
import { Pencil, Link as LinkIcon, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { UserButton, UserProfile } from "@clerk/clerk-react";
import Link from "next/link";
export function NavBar() {
 
  const { userId } = useAuth();
  const isLoggedIn = Boolean(userId); 
  return (
    <nav className="w-full bg-white  px-6 py-3 h-[70px] flex items-center justify-between border border-gray-600/20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-lg" >
          <span className="text-black">✱</span>
          <Link href={'/'}>
          
          NoteSage
          </Link>
          
        </div>
        <div className="flex items-center gap-6 text-gray-700 text-sm">
          <a href="#" className="hover:text-black font-semibold">Home</a>
          <a href="#" className="hover:text-black font-semibold">Explore</a>
          <a href="#" className="hover:text-black font-semibold">My Notes</a>
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
       {isLoggedIn ?  <UserButton></UserButton> : <div className="flex gap-2">
          <SignUpButton>
          <Button className="inline-block rounded-md border  bg-gray-800 px-8  text-sm font-medium text-white hover:bg-transparent  focus:ring-1 hover:text-gray-950 focus:outline-hidden" >Sign Up</Button>
        </SignUpButton>

          <Button className="inline-block rounded-md border bg-gray-800 px-8 text-sm font-medium text-white hover:bg-transparent hover:text-gray-950 focus:ring-1 focus:outline-hidden" ><SignInButton>Sign In</SignInButton></Button>
        
        </div> }
      </div>
    </nav>
  );
}
