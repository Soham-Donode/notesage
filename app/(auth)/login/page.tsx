"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/my-notes");
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/mynotes",
        redirectUrlComplete: "/mynotes",
      });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.errors?.[0]?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Brand Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-bold text-foreground mb-2">NoteSage</h1>
          <p className="text-muted-foreground">Welcome back! Sign in to continue</p>
        </div>

        {/* Main Card */}
        <div className="bg-card shadow-2xl rounded-3xl border-2 border-border p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full group relative px-6 py-3 bg-background text-foreground rounded-xl font-semibold
                       border-2 border-border
                       shadow-md hover:shadow-lg hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       overflow-hidden mb-6 hover-scale"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background
                           focus:border-primary focus:ring-0 focus:outline-none
                           transition-colors text-foreground placeholder-muted-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background
                           focus:border-primary focus:ring-0 focus:outline-none
                           transition-colors text-foreground placeholder-muted-foreground"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                href="/forgot-password"
                className="text-sm text-foreground font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         overflow-hidden hover-scale button-press"
            >
              <span className="relative z-10">
                {loading ? "Signing in..." : "Sign in"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="text-foreground font-semibold hover:underline"
            >
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-in fade-in duration-1000">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="text-foreground font-medium hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
