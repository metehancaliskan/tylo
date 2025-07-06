"use client";
import { Button } from "@/components/ui/button";
import React from "react";

interface SidebarProps {
  menuItems: { label: string; key: string }[];
  selected: string;
  setSelected: (key: string) => void;
  onLogout: () => void;
}

export function Sidebar({ menuItems, selected, setSelected, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-background p-6 hidden md:flex flex-col h-full justify-between">
      <div>
        <div className="mb-8">
          <div className="font-bold text-xl mb-2">Dashboard</div>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant={selected === item.key ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setSelected(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <Button variant="destructive" onClick={onLogout} className="mt-8">Logout</Button>
    </aside>
  );
} 