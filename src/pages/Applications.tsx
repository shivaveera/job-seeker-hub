import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileText } from "lucide-react";
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

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs(*)")
        .order("updated_at", { ascending: false });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-muted-foreground">Track your job applications</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-border">
              <CardContent className="p-5"><div className="h-16 rounded bg-muted" /></CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No applications yet</h3>
            <p className="text-sm text-muted-foreground">Start tracking your job applications from the Jobs page</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="border-border">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{(app as any).jobs?.job_title ?? "Unknown Job"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{(app as any).jobs?.company_name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(app.status)}
                    {app.applied_at && (
                      <span className="text-xs text-muted-foreground">
                        Applied {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Select value={app.status} onValueChange={(status) => updateStatus.mutate({ id: app.id, status })}>
                    <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(app as any).jobs?.apply_url && (
                    <a href={(app as any).jobs.apply_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteApp.mutate(app.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
