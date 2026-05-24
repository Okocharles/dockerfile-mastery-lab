"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import { Boxes, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sky-300 dark:bg-white dark:text-slate-950">
              <Boxes aria-hidden="true" size={22} />
            </span>
            <span>
              <span className="block text-base font-black leading-5 sm:text-lg">Dockerfile Mastery Lab</span>
              <span className="hidden text-xs font-semibold text-foreground/55 sm:block">Interactive instruction training</span>
            </span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="hidden dark:block" size={18} aria-hidden="true" />
            <Moon className="dark:hidden" size={18} aria-hidden="true" />
          </Button>
        </div>
      </header>
      {children}
    </>
  );
}
