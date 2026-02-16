import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  Flame,
  Clock,
  Users,
  Activity,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  applied: "#6366f1",
  interview_scheduled: "#f59e0b",
  offer: "#22c55e",
  rejected: "#ef4444",
  saved: "#6b7280",
  got_email: "#06b6d4",
  interview_done: "#a855f7",
  no_response: "#374151",
};

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#374151"];

const DOT_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-gray-500",
];

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
      const { data } = await supabase
        .from("jobs")
        .select("id, job_title, company_name, category, job_location, applicants, posted_at, experience_level")
        .order("created_at", { ascending: false })
        .limit(5);
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

  // Mock monthly data for the bar chart (will be replaced with real data later)
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
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </p>
      </div>

      {/* Stat cards — 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border border-white/10 bg-[#0d1414] p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <stat.icon className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500">{stat.title}</p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-gray-600">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Overall Activity</p>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{(appCount ?? 0) + (savedCount ?? 0)}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge className="border-0 bg-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>
          </div>
          <p className="mt-2 text-xs text-gray-600">Total interactions</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Active Applications</p>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{appCount ?? 0}</p>
          <p className="mt-1 text-xs text-gray-500">Across all statuses</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${Math.min(100, (appCount ?? 0) * 10)}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Avg Session Time</p>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">—</p>
          <p className="mt-1 text-xs text-gray-500">Coming soon</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Hot Topics (Top Categories) */}
      <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Hot Categories Right Now</h2>
        </div>
        <p className="mb-5 text-xs text-gray-500">Most active job categories based on listings</p>
        <div className="space-y-2">
          {(topCategories ?? []).map((cat, i) => {
            const pct = totalCategoryJobs ? Math.round((cat.value / totalCategoryJobs) * 100) : 0;
            const isHot = pct >= 20;
            return (
              <div key={cat.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-white">{cat.name}</span>
                <Badge className={`border-0 text-[10px] ${isHot ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                  {isHot ? "🔥 Hot" : "🔥 Warm"}
                </Badge>
                <span className="text-xs text-gray-500">{cat.value} jobs</span>
                <div className="h-1.5 w-20 rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${isHot ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-orange-500 to-yellow-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-white">{pct}%</span>
              </div>
            );
          })}
          {(topCategories ?? []).length === 0 && (
            <p className="py-8 text-center text-sm text-gray-600">No jobs imported yet</p>
          )}
        </div>
      </div>

      {/* Activity bar chart + Application donut */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Bar chart */}
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Application Activity
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Applications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Jobs Viewed
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0d1414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#fff", fontSize: "0.75rem" }}
              />
              <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Application Status
          </h2>
          <p className="mb-2 text-xs text-gray-500">Total: {appCount ?? 0} applications</p>
          {(statusBreakdown ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
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
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0d1414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#fff", fontSize: "0.75rem" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "0.65rem", color: "#9ca3af" }}
                  formatter={(val: string) => val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center text-sm text-gray-600">No applications yet</div>
          )}
        </div>
      </div>

      {/* Category heat map + Locations */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Category progress bars */}
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6 lg:col-span-3">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Job Category Heat Map
          </h2>
          <p className="mb-5 text-xs text-gray-500">Visual representation of job engagement and popularity trends</p>
          <div className="space-y-2">
            {(topCategories ?? []).map((cat, i) => {
              const pct = totalCategoryJobs ? Math.round((cat.value / totalCategoryJobs) * 100) : 0;
              const trend = pct > 30 ? "📈" : pct > 15 ? "—" : "📉";
              return (
                <div key={cat.name} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <div className="h-4 w-4 shrink-0 rounded bg-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{cat.name}</span>
                      <span className="text-xs">{trend}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className="border-0 bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0">{cat.name.split(" ")[0]}</Badge>
                      <span className="text-xs text-gray-500">{cat.value} jobs</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-24 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-white">{pct}%</span>
                </div>
              );
            })}
            {(topCategories ?? []).length === 0 && (
              <p className="py-8 text-center text-sm text-gray-600">No jobs imported yet</p>
            )}
          </div>
          {(topCategories ?? []).length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Heat Intensity:</span>
                <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-800" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-center gap-3">
                <span>📈 Rising</span>
                <span>— Stable</span>
                <span>📉 Declining</span>
              </div>
            </div>
          )}
        </div>

        {/* Jobs by Location */}
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Jobs by Location
          </h2>
          <p className="mb-5 text-xs text-gray-500">Top hiring locations</p>
          <div className="space-y-4">
            {(locationBreakdown ?? []).map((loc, i) => (
              <div key={loc.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[i] ?? DOT_COLORS[5]}`} />
                  <span className="text-sm text-gray-300">{loc.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{loc.pct}%</span>
              </div>
            ))}
            {(locationBreakdown ?? []).length === 0 && (
              <p className="py-8 text-center text-sm text-gray-600">No location data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Latest Jobs table */}
      <div className="rounded-xl border border-white/10 bg-[#0d1414] p-6">
        <h2 className="mb-4 text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Latest Jobs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                <th className="pb-3 font-medium">Job</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Experience</th>
                <th className="pb-3 text-right font-medium">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {(recentJobs ?? []).map((job) => (
                <tr key={job.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3">
                    <p className="font-medium text-white">{job.job_title}</p>
                    <p className="text-xs text-gray-500">{job.company_name ?? "—"}</p>
                  </td>
                  <td className="py-3">
                    {job.category ? (
                      <Badge className="border-0 bg-emerald-500/20 text-emerald-400 text-[10px]">{job.category}</Badge>
                    ) : "—"}
                  </td>
                  <td className="py-3 text-gray-400">{job.job_location ?? "—"}</td>
                  <td className="py-3 text-gray-400">{job.experience_level ?? "—"}</td>
                  <td className="py-3 text-right font-medium text-white">{job.applicants ?? "—"}</td>
                </tr>
              ))}
              {(recentJobs ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-600">No jobs imported yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 pb-4">
        © 2026 F1Work • Built for international students
      </div>
    </div>
  );
}
