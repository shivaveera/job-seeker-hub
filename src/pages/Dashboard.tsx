import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Bookmark, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: jobCount } = useQuery({
    queryKey: ["jobCount"],
    queryFn: async () => {
      const { count } = await supabase.from("jobs").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: appCount } = useQuery({
    queryKey: ["appCount"],
    queryFn: async () => {
      const { count } = await supabase.from("applications").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: savedCount } = useQuery({
    queryKey: ["savedCount"],
    queryFn: async () => {
      const { count } = await supabase.from("saved_jobs").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { title: "Available Jobs", value: jobCount ?? 0, icon: Briefcase, color: "text-primary" },
    { title: "Applications", value: appCount ?? 0, icon: FileText, color: "text-accent-foreground" },
    { title: "Saved Jobs", value: savedCount ?? 0, icon: Bookmark, color: "text-warning" },
    { title: "Response Rate", value: "—", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">Here's an overview of your job search</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Browse the <strong>Jobs</strong> page to find F1/CPT/OPT-friendly positions</p>
          <p>• Save interesting jobs and track your applications</p>
          <p>• Use the <strong>Applications</strong> tracker to monitor your progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
