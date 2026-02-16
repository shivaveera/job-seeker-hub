import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  applied: "hsl(252, 56%, 57%)",
  interview_scheduled: "hsl(38, 92%, 50%)",
  offer: "hsl(142, 71%, 45%)",
  rejected: "hsl(0, 84%, 60%)",
  saved: "hsl(240, 5%, 55%)",
  got_email: "hsl(190, 70%, 50%)",
  interview_done: "hsl(280, 60%, 55%)",
  no_response: "hsl(240, 4%, 36%)",
};

const TREND_ICON: Record<string, string> = {
  rising: "📈",
  stable: "—",
  declining: "📉",
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: jobCount } = useQuery({
    queryKey: ["jobCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: appCount } = useQuery({
    queryKey: ["appCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: savedCount } = useQuery({
    queryKey: ["savedCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("saved_jobs")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: applications } = useQuery({
    queryKey: ["dashApplications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("*, jobs(job_title, company_name, job_location, category)")
        .order("updated_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: topCategories } = useQuery({
    queryKey: ["topCategories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("category")
        .not("category", "is", null);
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((j) => {
        const cat = j.category || "Other";
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    },
  });

  const { data: statusBreakdown } = useQuery({
    queryKey: ["statusBreakdown"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("status");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((a) => {
        counts[a.status] = (counts[a.status] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });

  const { data: recentJobs } = useQuery({
    queryKey: ["recentJobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("id, job_title, company_name, category, job_location, applicants, posted_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: locationBreakdown } = useQuery({
    queryKey: ["locationBreakdown"],
    queryFn: async () => {
      const { data } = await supabase
        .from("jobs")
        .select("job_location")
        .not("job_location", "is", null)
        .limit(500);
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((j) => {
        const loc = (j.job_location || "Unknown").split(",")[0].trim();
        counts[loc] = (counts[loc] || 0) + 1;
      });
      const total = Object.values(counts).reduce((s, v) => s + v, 0);
      return Object.entries(counts)
        .map(([name, value]) => ({
          name,
          value,
          pct: total ? Math.round((value / total) * 100) : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    },
  });

  const DOT_COLORS = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-muted-foreground",
  ];

  const PIE_COLORS = [
    "hsl(252, 56%, 57%)",
    "hsl(142, 71%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(0, 84%, 60%)",
    "hsl(190, 70%, 50%)",
    "hsl(280, 60%, 55%)",
  ];

  const stats = [
    {
      title: "Available Jobs",
      value: jobCount ?? 0,
      icon: Briefcase,
      sub: "Updated daily",
    },
    {
      title: "Applications",
      value: appCount ?? 0,
      icon: FileText,
      sub: "All time",
    },
    {
      title: "Saved Jobs",
      value: savedCount ?? 0,
      icon: Bookmark,
      sub: "Your watchlist",
    },
    {
      title: "Response Rate",
      value: "—",
      icon: TrendingUp,
      sub: "Coming soon",
    },
  ];

  const totalCategoryJobs = (topCategories ?? []).reduce(
    (s, c) => s + c.value,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back
          {user?.user_metadata?.full_name
            ? `, ${user.user_metadata.full_name}`
            : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's an overview of your job search
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <stat.icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle row: heat-map-style category list + donut chart */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Job Categories — wide */}
        <Card className="border-border lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Categories</CardTitle>
            <p className="text-xs text-muted-foreground">
              Distribution of available positions
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(topCategories ?? []).map((cat, i) => {
              const pct = totalCategoryJobs
                ? Math.round((cat.value / totalCategoryJobs) * 100)
                : 0;
              return (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="h-4 w-4 shrink-0 rounded bg-muted" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cat.value} jobs
                    </span>
                  </div>
                  <Progress value={pct} className="h-2 w-24" />
                  <span className="w-10 text-right text-sm font-semibold">
                    {pct}%
                  </span>
                </div>
              );
            })}
            {(topCategories ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No jobs imported yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Jobs by Location</CardTitle>
            <p className="text-xs text-muted-foreground">
              Top hiring locations
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {(locationBreakdown ?? []).map((loc, i) => (
              <div key={loc.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[i] ?? DOT_COLORS[5]}`}
                  />
                  <span className="text-sm">{loc.name}</span>
                </div>
                <span className="text-sm font-semibold">{loc.pct}%</span>
              </div>
            ))}
            {(locationBreakdown ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No location data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application status donut + Recent applications */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Donut */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Application Status</CardTitle>
            <p className="text-xs text-muted-foreground">
              Total: {appCount ?? 0} applications
            </p>
          </CardHeader>
          <CardContent>
            {(statusBreakdown ?? []).length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {(statusBreakdown ?? []).map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          STATUS_COLORS[entry.name] ??
                          PIE_COLORS[index % PIE_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: "0.7rem" }}
                    formatter={(val: string) =>
                      val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                No applications yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent jobs table */}
        <Card className="border-border lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Job</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Location</th>
                    <th className="pb-2 text-right font-medium">Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentJobs ?? []).map((job) => (
                    <tr key={job.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{job.job_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.company_name ?? "—"}
                        </p>
                      </td>
                      <td className="py-3">
                        {job.category ? (
                          <Badge variant="secondary" className="text-xs">
                            {job.category}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {job.job_location ?? "—"}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {job.applicants ?? "—"}
                      </td>
                    </tr>
                  ))}
                  {(recentJobs ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No jobs imported yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Browse the <strong>Jobs</strong> page to find F1/CPT/OPT-friendly
            positions
          </p>
          <p>• Save interesting jobs and track your applications</p>
          <p>
            • Use the <strong>Applications</strong> tracker to monitor your
            progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
