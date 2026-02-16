import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs",
  "/applications": "Applications",
  "/saved": "Saved Jobs",
  "/profile": "Profile",
};

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "F1Work";

  return (
    <div className="flex min-h-screen w-full bg-background dark">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-6">
          <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
          <div className="flex-1" />
          <div className={`relative transition-all duration-300 ease-out ${searchFocused ? "w-80" : "w-48"}`}>
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-8 pl-9 text-xs bg-secondary/50 border-border focus:bg-card"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          <button className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="animate-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
