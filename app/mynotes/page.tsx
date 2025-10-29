"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { NavBar } from "@/components/NavBar";

const MyNotesPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      {/* Page Content (always rendered, blurred by modal if needed) */}
       <NavBar/>
      <div className="min-h-screen bg-background p-6">
       
        <h1 className="text-3xl font-bold text-foreground mb-4">My Notes</h1>
        <p className="text-muted-foreground">Welcome! Your notes dashboard is here.</p>
        {/* Add your notes listing, search, or other features below */}
      </div>

      {/* Auth Modal Overlay */}
      <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
    </>
  );
};

export default MyNotesPage;