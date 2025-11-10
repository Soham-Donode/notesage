"use client";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

interface NavBarProps {
  onSearchClick?: () => void;
}

export function NavBar({ onSearchClick }: NavBarProps) {
  const { userId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = Boolean(userId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-4 h-[70px] flex items-center justify-between border-b border-border shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2 font-bold text-lg sm:text-xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center hover-scale">
            <span className="text-primary-foreground text-base sm:text-lg">✱</span>
          </div>
          <Link href={'/'} className="text-foreground hover:text-primary transition-colors">
            NoteSage
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-muted-foreground text-sm">
          <Link href="/" className="hover:text-primary font-semibold transition-colors">Home</Link>
          <Link href="/explore" className="hover:text-primary font-semibold transition-colors">Explore</Link>
          <Link href="/mynotes" className="hover:text-primary font-semibold transition-colors">My Notes</Link>
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover-scale button-press"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <button
          onClick={onSearchClick}
          className="flex items-center bg-muted px-3 lg:px-4 w-[200px] lg:w-[250px] py-2 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-text"
        >
          <Search size={16} className="mr-2 lg:mr-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs lg:text-sm hidden sm:inline">Search notes and posts...</span>
          <span className="text-muted-foreground text-xs sm:hidden">Search...</span>
          <kbd className="ml-auto text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border hidden lg:inline">
            ⌘K
          </kbd>
        </button>
        {isLoggedIn ? (
          <UserButton />
        ) : (
          <div className="flex gap-2 lg:gap-3">
            <Link href="/signup" className="inline-block rounded-xl border border-border bg-background px-3 lg:px-6 py-2 text-xs lg:text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md hover-scale">
              Sign Up
            </Link>
            <Link href="/login" className="inline-block rounded-xl bg-primary px-3 lg:px-6 py-2 text-xs lg:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover-scale button-press">
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover-scale button-press"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover-scale"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-[70px] left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <button
                onClick={() => {
                  onSearchClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full bg-muted px-4 py-3 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <Search size={16} className="mr-3 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Search notes and posts...</span>
              </button>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/explore"
                  className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/mynotes"
                  className="block px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Notes
                </Link>
              </div>

              {/* Mobile Auth */}
              {!isLoggedIn && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Link
                    href="/signup"
                    className="flex-1 text-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 text-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}