import { Briefcase, LayoutDashboard, FileText, Bookmark, User, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Saved Jobs", url: "/saved", icon: Bookmark },
];

export function AppSidebar() {
  const { signOut, user } = useAuth();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">F1</span>
        </div>
        <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          F1Work
        </span>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <User className="h-4 w-4" />
                <span className="truncate">{user?.email ?? "Profile"}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
