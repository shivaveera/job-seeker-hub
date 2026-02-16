import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) toast.error(error.message);
    else setSent(true);
  };

  if (sent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-6 dark">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-sm text-center animate-in">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:bg-secondary hover:text-foreground">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 dark">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

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
          <h1 className="mb-1 text-2xl font-bold text-foreground">Create account</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-smooth">Sign in</Link>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
            </div>
            <Button type="submit" className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground font-mono">// JOIN 10,000+ STUDENTS</p>
      </div>
    </div>
  );
}
