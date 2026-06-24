"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function AdminNavbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b bg-background">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <PanelLeft className="w-4 h-4" />
      </Button>
    </nav>
  );
}