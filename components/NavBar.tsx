"use client";
import { Search, Sun, Moon } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "./ui/button"; // Optional: Reuse if needed for other buttons
import { useTheme } from "./ThemeProvider";

export function NavBar() {
  const { userId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = Boolean(userId);
  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm px-6 py-4 h-[70px] flex items-center justify-between border-b border-border shadow-sm transition-all duration-300">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center hover-scale">
            <span className="text-primary-foreground text-lg">✱</span>
          </div>
          <Link href={'/'} className="text-foreground hover:text-primary transition-colors">
            NoteSage
          </Link>
        </div>
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          <Link href="/" className="hover:text-primary font-semibold transition-colors">Home</Link>
          <Link href="/explore" className="hover:text-primary font-semibold transition-colors">Explore</Link>
          <Link href="/mynotes" className="hover:text-primary font-semibold transition-colors">My Notes</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover-scale button-press"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <div className="flex items-center bg-muted px-4 w-[250px] py-2 rounded-xl border border-border hover:border-primary/50 transition-colors">
          <Search size={18} className="mr-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes and posts..."
            className="bg-transparent outline-none border-none w-full text-foreground placeholder-muted-foreground text-sm"
          />
        </div>
        {isLoggedIn ? (
          <UserButton />
        ) : (
          <div className="flex gap-3">
           
              <Link href="/signup"className="inline-block rounded-xl border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md hover-scale">
                Sign Up
              </Link>
            
           
              <Link href="/login" className="inline-block rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover-scale button-press">
                Sign In
              </Link>
       
          </div>
        )}
      </div>
    </nav>
  );
}