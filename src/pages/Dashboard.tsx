import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase, FileText, Bookmark, TrendingUp, Flame, Clock, Users, Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  applied: "#6366f1", interview_scheduled: "#f59e0b", offer: "#22c55e",
  rejected: "#ef4444", saved: "#6b7280", got_email: "#06b6d4",
  interview_done: "#a855f7", no_response: "#374151",
};
const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#374151"];
const DOT_COLORS = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-muted-foreground"];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: jobCount } = useQuery({
    queryKey: ["jobCount"],
    queryFn: async () => { const { count } = await supabase.from("jobs").select("*", { count: "exact", head: true }); return count ?? 0; },
  });
  const { data: appCount } = useQuery({
    queryKey: ["appCount"],
    queryFn: async () => { const { count } = await supabase.from("applications").select("*", { count: "exact", head: true }); return count ?? 0; },
  });
  const { data: savedCount } = useQuery({
    queryKey: ["savedCount"],
    queryFn: async () => { const { count } = await supabase.from("saved_jobs").select("*", { count: "exact", head: true }); return count ?? 0; },
  });
  const { data: topCategories } = useQuery({
    queryKey: ["topCategories"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("category").not("category", "is", null);
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((j) => { counts[j.category || "Other"] = (counts[j.category || "Other"] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
    },
  });
  const { data: statusBreakdown } = useQuery({
    queryKey: ["statusBreakdown"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("status");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });
  const { data: recentJobs } = useQuery({
    queryKey: ["recentJobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("id, job_title, company_name, category, job_location, applicants, posted_at, experience_level").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });
  const { data: locationBreakdown } = useQuery({
    queryKey: ["locationBreakdown"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("job_location").not("job_location", "is", null).limit(500);
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((j) => { const loc = (j.job_location || "Unknown").split(",")[0].trim(); counts[loc] = (counts[loc] || 0) + 1; });
      const total = Object.values(counts).reduce((s, v) => s + v, 0);
      return Object.entries(counts).map(([name, value]) => ({ name, value, pct: total ? Math.round((value / total) * 100) : 0 })).sort((a, b) => b.value - a.value).slice(0, 6);
    },
  });

  const monthlyData = [
    { month: "Jan", applications: 0, views: 0 },
    { month: "Feb", applications: appCount ?? 0, views: jobCount ?? 0 },
  ];
  const totalCategoryJobs = (topCategories ?? []).reduce((s, c) => s + c.value, 0);

  const stats = [
    { title: "Available Jobs", value: jobCount ?? 0, icon: Briefcase, sub: "Updated daily" },
    { title: "Applications", value: appCount ?? 0, icon: FileText, sub: "All time" },
    { title: "Saved Jobs", value: savedCount ?? 0, icon: Bookmark, sub: "Your watchlist" },
    { title: "Response Rate", value: "—", icon: TrendingUp, sub: "Coming soon" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.title} className="rounded-xl border border-border bg-card p-5 hover-lift" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground/60">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Overall Activity</p>
            <Flame className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{(appCount ?? 0) + (savedCount ?? 0)}</p>
          <Badge className="mt-1 border-0 bg-primary/10 text-primary text-[10px]">Active</Badge>
          <p className="mt-2 text-xs text-muted-foreground/60">Total interactions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active Applications</p>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{appCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all statuses</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-500" style={{ width: `${Math.min(100, (appCount ?? 0) * 10)}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Avg Session Time</p>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Coming soon</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Hot Categories */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-bold text-foreground">Hot Categories Right Now</h2>
        </div>
        <p className="mb-5 text-xs text-muted-foreground">Most active job categories based on listings</p>
        <div className="space-y-2">
          {(topCategories ?? []).map((cat, i) => {
            const pct = totalCategoryJobs ? Math.round((cat.value / totalCategoryJobs) * 100) : 0;
            const isHot = pct >= 20;
            return (
              <div key={cat.name} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3 transition-smooth hover:bg-secondary/40">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{i + 1}</span>
                <span className="flex-1 text-sm font-medium text-foreground">{cat.name}</span>
                <Badge className={`border-0 text-[10px] ${isHot ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"}`}>
                  {isHot ? "🔥 Hot" : "🔥 Warm"}
                </Badge>
                <span className="text-xs text-muted-foreground">{cat.value} jobs</span>
                <div className="h-1.5 w-20 rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${isHot ? "bg-gradient-to-r from-destructive to-warning" : "bg-gradient-to-r from-warning to-yellow-500"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-foreground">{pct}%</span>
              </div>
            );
          })}
          {(topCategories ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No jobs imported yet</p>}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Application Activity</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Applications</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Jobs Viewed</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", color: "hsl(var(--foreground))", fontSize: "0.75rem" }} />
              <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="views" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">Application Status</h2>
          <p className="mb-2 text-xs text-muted-foreground">Total: {appCount ?? 0} applications</p>
          {(statusBreakdown ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {(statusBreakdown ?? []).map((entry, index) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", color: "hsl(var(--foreground))", fontSize: "0.75rem" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "0.65rem", color: "hsl(var(--muted-foreground))" }} formatter={(val: string) => val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">No applications yet</div>
          )}
        </div>
      </div>

      {/* Category heat + locations */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <h2 className="text-lg font-bold text-foreground">Job Category Heat Map</h2>
          <p className="mb-5 text-xs text-muted-foreground">Visual representation of job engagement and popularity trends</p>
          <div className="space-y-2">
            {(topCategories ?? []).map((cat) => {
              const pct = totalCategoryJobs ? Math.round((cat.value / totalCategoryJobs) * 100) : 0;
              const trend = pct > 30 ? "📈" : pct > 15 ? "—" : "📉";
              return (
                <div key={cat.name} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3 transition-smooth hover:bg-secondary/40">
                  <div className="h-4 w-4 shrink-0 rounded bg-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      <span className="text-xs">{trend}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className="border-0 bg-primary/20 text-primary text-[9px] px-1.5 py-0">{cat.name.split(" ")[0]}</Badge>
                      <span className="text-xs text-muted-foreground">{cat.value} jobs</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-24 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-foreground">{pct}%</span>
                </div>
              );
            })}
            {(topCategories ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No jobs imported yet</p>}
          </div>
          {(topCategories ?? []).length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span>Heat Intensity:</span>
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-center gap-3">
                <span>📈 Rising</span><span>— Stable</span><span>📉 Declining</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">Jobs by Location</h2>
          <p className="mb-5 text-xs text-muted-foreground">Top hiring locations</p>
          <div className="space-y-4">
            {(locationBreakdown ?? []).map((loc, i) => (
              <div key={loc.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[i] ?? DOT_COLORS[5]}`} />
                  <span className="text-sm text-muted-foreground">{loc.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{loc.pct}%</span>
              </div>
            ))}
            {(locationBreakdown ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No location data yet</p>}
          </div>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Latest Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Job</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Experience</th>
                <th className="pb-3 text-right font-medium">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {(recentJobs ?? []).map((job) => (
                <tr key={job.id} className="border-b border-border/50 last:border-0 transition-smooth hover:bg-secondary/30">
                  <td className="py-3">
                    <p className="font-medium text-foreground">{job.job_title}</p>
                    <p className="text-xs text-muted-foreground">{job.company_name ?? "—"}</p>
                  </td>
                  <td className="py-3">
                    {job.category ? <Badge className="border-0 bg-primary/20 text-primary text-[10px]">{job.category}</Badge> : "—"}
                  </td>
                  <td className="py-3 text-muted-foreground">{job.job_location ?? "—"}</td>
                  <td className="py-3 text-muted-foreground">{job.experience_level ?? "—"}</td>
                  <td className="py-3 text-right font-medium text-foreground">{job.applicants ?? "—"}</td>
                </tr>
              ))}
              {(recentJobs ?? []).length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No jobs imported yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pb-4">© 2026 F1Work • Built for international students</div>
    </div>
  );
}
