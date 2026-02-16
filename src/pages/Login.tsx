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
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0f0f] px-6">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />

      {/* Back nav */}
      <Link to="/" className="absolute left-6 top-6 z-10">
        <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:bg-white/5 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      {/* Logo */}
      <div className="absolute left-6 top-6 z-10 ml-24 flex items-center gap-2.5 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
          <span className="text-sm font-bold text-white">F1</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          F1Work
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-xl border border-white/10 bg-[#0d1414] p-8">
          <h1 className="mb-1 text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300 transition">Sign up</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-lg border border-white/10 bg-white px-8 text-black hover:bg-gray-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500" style={{ fontFamily: "monospace" }}>
          // SECURE · ENCRYPTED · PRIVATE
        </p>
      </div>
    </div>
  );
}
