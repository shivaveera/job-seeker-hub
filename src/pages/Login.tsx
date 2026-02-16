import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 dark">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

      <Link to="/" className="absolute left-6 top-6 z-10">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      <div className="absolute left-6 top-6 z-10 ml-24 flex items-center gap-2.5 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">F1</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">F1Work</span>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in">
        <div className="rounded-xl border border-border bg-card p-8">
          <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-smooth">Sign up</Link>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <Button type="submit" className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground font-mono">// SECURE · ENCRYPTED · PRIVATE</p>
      </div>
    </div>
  );
}
