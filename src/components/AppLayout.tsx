import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0a0f0f]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b border-white/10 bg-[#0d1414] px-4">
            <SidebarTrigger className="text-gray-400 hover:text-white" />
          </header>
          <main className="flex-1 overflow-auto bg-[#0a0f0f] p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
