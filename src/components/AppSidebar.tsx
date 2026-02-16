import { Briefcase, LayoutDashboard, FileText, Bookmark, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Saved Jobs", url: "/saved", icon: Bookmark },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { signOut, user } = useAuth();

  return (
    <aside className={cn(
      "flex flex-col border-r border-border bg-card transition-all duration-300 ease-out shrink-0",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">F1</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-foreground whitespace-nowrap">F1Work</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className={cn(
          "mb-2 text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 transition-all duration-300",
          collapsed && "opacity-0"
        )}>Menu</p>
        {mainNav.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/dashboard"}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-smooth",
              collapsed && "justify-center px-0",
              isActive
                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) => cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-smooth",
            collapsed && "justify-center px-0",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <User className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">{user?.email ?? "Profile"}</span>}
        </NavLink>
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive cursor-pointer",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth mt-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
