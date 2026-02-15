import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, MapPin, Building2, Clock, ExternalLink, Bookmark, BookmarkCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function Jobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [workplaceFilter, setWorkplaceFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: savedJobIds = [] } = useQuery({
    queryKey: ["savedJobIds"],
    queryFn: async () => {
      const { data } = await supabase.from("saved_jobs").select("job_id");
      return data?.map((s) => s.job_id) ?? [];
    },
  });

  const toggleSave = useMutation({
    mutationFn: async (jobId: string) => {
      const isSaved = savedJobIds.includes(jobId);
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("user_id", user!.id);
      } else {
        await supabase.from("saved_jobs").insert({ job_id: jobId, user_id: user!.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      queryClient.invalidateQueries({ queryKey: ["savedCount"] });
    },
    onError: () => toast.error("Failed to update saved job"),
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.job_title.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      job.job_location?.toLowerCase().includes(search.toLowerCase());
    const matchesWorkplace = workplaceFilter === "all" || job.workplace_type === workplaceFilter;
    const matchesExperience = experienceFilter === "all" || job.experience_level === experienceFilter;
    return matchesSearch && matchesWorkplace && matchesExperience;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-sm text-muted-foreground">Browse F1/CPT/OPT-friendly positions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={workplaceFilter} onValueChange={setWorkplaceFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Workplace" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="on_site">On-site</SelectItem>
          </SelectContent>
        </Select>
        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Experience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="mid">Mid Level</SelectItem>
            <SelectItem value="senior">Senior Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{filteredJobs.length} jobs found</p>

      {/* Job Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-6"><div className="h-20 rounded bg-muted" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No jobs found</h3>
            <p className="text-sm text-muted-foreground">
              {search ? "Try adjusting your search or filters" : "Jobs will appear here once they are uploaded"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Collapsible key={job.id} open={expandedJob === job.id} onOpenChange={(open) => setExpandedJob(open ? job.id : null)}>
              <Card className="border-border transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-semibold truncate">{job.job_title}</h3>
                        {job.easy_apply && <Badge variant="secondary" className="text-xs">Easy Apply</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        {job.company_name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />{job.company_name}
                          </span>
                        )}
                        {job.job_location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />{job.job_location}
                          </span>
                        )}
                        {job.posted_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />{formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {job.workplace_type && <Badge variant="outline" className="text-xs">{job.workplace_type}</Badge>}
                        {job.employment_type && <Badge variant="outline" className="text-xs">{job.employment_type}</Badge>}
                        {job.experience_level && <Badge variant="outline" className="text-xs">{job.experience_level}</Badge>}
                        {job.category && <Badge variant="outline" className="text-xs">{job.category}</Badge>}
                        {(job.salary_min || job.salary_max) && (
                          <Badge variant="secondary" className="text-xs">
                            {job.salary_min && job.salary_max
                              ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                              : job.salary_min
                              ? `From $${job.salary_min.toLocaleString()}`
                              : `Up to $${job.salary_max!.toLocaleString()}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave.mutate(job.id)}
                        className={savedJobIds.includes(job.id) ? "text-primary" : "text-muted-foreground"}
                      >
                        {savedJobIds.includes(job.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </Button>
                      {job.apply_url && (
                        <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm">Apply <ExternalLink className="ml-1 h-3 w-3" /></Button>
                        </a>
                      )}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedJob === job.id ? "rotate-180" : ""}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-4 border-t border-border pt-4">
                      {job.description ? (
                        <div className="prose prose-sm max-w-none text-sm text-muted-foreground whitespace-pre-wrap">
                          {job.description}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description available</p>
                      )}
                      <div className="mt-4 flex gap-2">
                        {job.job_url && (
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">View Job <ExternalLink className="ml-1 h-3 w-3" /></Button>
                          </a>
                        )}
                        {job.company_url && (
                          <a href={job.company_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">Company <ExternalLink className="ml-1 h-3 w-3" /></Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
