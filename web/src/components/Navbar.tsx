"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Code2, Github, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-lg bg-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div onClick={() => (window.location.href = "/")} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">SnipZen</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/srinivas-batthula/code-snippets-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition"
          >
            <Github className="w-5 h-5" />
          </a>

          {session?.user ? (
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/profile")}
              className="gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          ) : (
            <Button onClick={() => signIn()} className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
