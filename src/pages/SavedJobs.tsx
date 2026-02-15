import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
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
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, jobs(*)")
        .order("created_at", { ascending: false });
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
      const { error } = await supabase.from("applications").insert({
        user_id: user!.id,
        job_id: jobId,
        status: "saved",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appCount"] });
      toast.success("Added to applications");
    },
    onError: (err: any) => {
      if (err.message?.includes("duplicate")) {
        toast.info("Already in your applications");
      } else {
        toast.error("Failed to add");
      }
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse border-border">
              <CardContent className="p-5"><div className="h-16 rounded bg-muted" /></CardContent>
            </Card>
          ))}
        </div>
      ) : saved.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No saved jobs</h3>
            <p className="text-sm text-muted-foreground">Bookmark jobs from the Jobs page to save them here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {saved.map((s) => {
            const job = (s as any).jobs;
            return (
              <Card key={s.id} className="border-border">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{job?.job_title ?? "Unknown"}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {job?.company_name && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company_name}</span>}
                      {job?.job_location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.job_location}</span>}
                    </div>
                    {job?.workplace_type && <Badge variant="outline" className="mt-2 text-xs">{job.workplace_type}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => addToApplications.mutate(s.job_id)}>
                      <Plus className="mr-1 h-3 w-3" /> Track
                    </Button>
                    {job?.apply_url && (
                      <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm">Apply <ExternalLink className="ml-1 h-3 w-3" /></Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeSaved.mutate(s.id)}>
                      <BookmarkX className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
