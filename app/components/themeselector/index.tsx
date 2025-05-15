"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="dark:bg-slate-700 dark:hover:bg-slate-600 p-2.5 rounded-md bg-violet-300 hover:bg-violet-400">
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 -translate-y-5" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark:!bg-slate-800 !text-center !bg-slate-300 !w-28 !min-w-0 border-none my-1"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer bg-slate-300 p-2 rounded-md hover:bg-slate-400 dark:bg-slate-800 dark:hover:!bg-slate-600 justify-center"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer bg-slate-300 p-2 rounded-md hover:bg-slate-400 dark:bg-slate-800 dark:hover:!bg-slate-600 justify-center"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer bg-slate-300 p-2 rounded-md hover:bg-slate-400 dark:bg-slate-800 dark:hover:!bg-slate-600 justify-center"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
