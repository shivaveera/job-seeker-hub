import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkX, ExternalLink, MapPin, Building2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function SavedJobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: saved = [], isLoading } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_jobs").select("*, jobs(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const removeSaved = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      queryClient.invalidateQueries({ queryKey: ["savedCount"] });
      toast.success("Removed from saved");
    },
  });

  const addToApplications = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase.from("applications").insert({ user_id: user!.id, job_id: jobId, status: "saved" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appCount"] });
      toast.success("Added to applications");
    },
    onError: (err: any) => {
      if (err.message?.includes("duplicate")) toast.info("Already in your applications");
      else toast.error("Failed to add");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
              <div className="h-5 w-1/3 rounded bg-muted mb-2" />
              <div className="h-4 w-1/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 text-center">
          <Bookmark className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No saved jobs</h3>
          <p className="text-sm text-muted-foreground">Bookmark jobs from the Jobs page to save them here</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s) => {
            const job = (s as any).jobs;
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-300 ease-out hover:border-accent-foreground/20 hover:shadow-lg hover:shadow-primary/5 group">
                <h3 className="font-semibold text-foreground truncate mb-1">{job?.job_title ?? "Unknown"}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  {job?.company_name && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company_name}</span>}
                  {job?.job_location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.job_location}</span>}
                </div>
                {job?.workplace_type && <Badge variant="outline" className="text-xs border-border mb-4">{job.workplace_type}</Badge>}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => addToApplications.mutate(s.job_id)}>
                    <Plus className="mr-1 h-3 w-3" /> Track
                  </Button>
                  {job?.apply_url && (
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="text-xs hover-lift">Apply <ExternalLink className="ml-1 h-3 w-3" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeSaved.mutate(s.id)}>
                    <BookmarkX className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
