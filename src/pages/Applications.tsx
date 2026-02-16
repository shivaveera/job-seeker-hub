import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ExternalLink, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const STATUS_OPTIONS = [
  { value: "saved", label: "Saved", color: "bg-muted text-muted-foreground" },
  { value: "applied", label: "Applied", color: "bg-primary/10 text-primary" },
  { value: "got_email", label: "Got Email", color: "bg-accent text-accent-foreground" },
  { value: "interview_scheduled", label: "Interview Scheduled", color: "bg-warning/10 text-warning" },
  { value: "interview_done", label: "Interview Done", color: "bg-warning/20 text-warning" },
  { value: "offer", label: "Offer", color: "bg-success/10 text-success" },
  { value: "rejected", label: "Rejected", color: "bg-destructive/10 text-destructive" },
  { value: "no_response", label: "No Response", color: "bg-muted text-muted-foreground" },
];

export default function Applications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("*, jobs(*)").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === "applied") updates.applied_at = new Date().toISOString();
      const { error } = await supabase.from("applications").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Status updated");
    },
  });

  const deleteApp = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appCount"] });
      toast.success("Application removed");
    },
  });

  const getStatusBadge = (status: string) => {
    const s = STATUS_OPTIONS.find((o) => o.value === status);
    return s ? <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span> : status;
  };

  const filtered = applications.filter((app) => {
    const job = (app as any).jobs;
    const matchesSearch = !searchTerm || job?.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || job?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-sm text-muted-foreground">Track your job applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by job or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(statusFilter === s.value ? "all" : s.value)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-smooth ${statusFilter === s.value ? s.color + " ring-1 ring-primary/30" : "bg-secondary text-muted-foreground hover:bg-accent"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
              <div className="h-5 w-1/3 rounded bg-muted mb-2" />
              <div className="h-4 w-1/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No applications yet</h3>
          <p className="text-sm text-muted-foreground">Start tracking your job applications from the Jobs page</p>
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-secondary/30">
                  <th className="px-5 py-3 font-medium">Job</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Applied</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const job = (app as any).jobs;
                  return (
                    <tr key={app.id} className="border-b border-border last:border-0 transition-smooth hover:bg-secondary/30">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{job?.job_title ?? "Unknown Job"}</p>
                        <p className="text-xs text-muted-foreground">{job?.company_name}</p>
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {app.applied_at ? formatDistanceToNow(new Date(app.applied_at), { addSuffix: true }) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Select value={app.status} onValueChange={(status) => updateStatus.mutate({ id: app.id, status })}>
                            <SelectTrigger className="w-[150px] h-8 text-xs bg-card border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          {job?.apply_url && (
                            <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-3.5 w-3.5" /></Button>
                            </a>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteApp.mutate(app.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
