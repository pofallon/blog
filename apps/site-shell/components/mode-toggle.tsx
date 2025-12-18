"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 rounded-xl border-[1.5px] border-border bg-g2k-bg-sunken hover:bg-g2k-bg-sunken"
          style={{
            boxShadow: `
              inset 0 2px 4px hsl(var(--g2k-shadow-color) / 0.1),
              inset 0 -1px 0 hsl(0 0% 100% / 0.05),
              0 1px 2px hsl(var(--g2k-shadow-color) / 0.1)
            `.replace(/\s+/g, ' ').trim()
          }}
        >
          {/* Outer bezel ring */}
          <span 
            className="absolute inset-0.5 rounded-[10px] pointer-events-none"
            style={{ 
              boxShadow: 'inset 0 0 0 1px hsl(var(--g2k-border) / 0.5)'
            }}
            aria-hidden="true"
          />
          
          {/* Indicator dot - glows based on theme */}
          <span 
            className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--g2k-brass-shine)), hsl(var(--g2k-brass)))'
            }}
            aria-hidden="true"
          />
          
          {/* Icons */}
          <Sun className="h-[1.1rem] w-[1.1rem] text-g2k-brass scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] text-g2k-teal scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-g2k-bg-raised border-[1.5px] border-g2k-border rounded-xl"
        style={{ boxShadow: 'var(--g2k-shadow-lg), var(--g2k-shadow-inset)' }}
      >
        <DropdownMenuItem 
          onClick={() => { setTheme("light"); }}
          className={`flex items-center gap-2 cursor-pointer rounded-lg ${theme === 'light' ? 'text-g2k-brass bg-g2k-brass/10' : ''}`}
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { setTheme("dark"); }}
          className={`flex items-center gap-2 cursor-pointer rounded-lg ${theme === 'dark' ? 'text-g2k-teal bg-g2k-teal/10' : ''}`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => { setTheme("system"); }}
          className={`flex items-center gap-2 cursor-pointer rounded-lg ${theme === 'system' ? 'text-g2k-fg-primary bg-g2k-fg-primary/5' : ''}`}
        >
          <Monitor className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
