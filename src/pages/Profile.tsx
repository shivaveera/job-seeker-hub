import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.full_name) setFullName(data.full_name);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    setLoading(false);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Account overview card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{fullName || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Badge className="ml-auto bg-primary/10 text-primary border-0">Active</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Email
            </Label>
            <Input value={user?.email ?? ""} disabled className="bg-secondary/50 border-border text-muted-foreground" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3 w-3" /> Full Name
            </Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-card border-border" placeholder="Enter your full name" />
          </div>
          <Button onClick={handleSave} disabled={loading} className="hover-lift">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Subscription placeholder */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Subscription</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Subscription management coming soon. You'll be able to view your plan, update payment methods, and manage your billing here.</p>
        <Badge variant="outline" className="border-border">Free Plan</Badge>
      </div>
    </div>
  );
}
