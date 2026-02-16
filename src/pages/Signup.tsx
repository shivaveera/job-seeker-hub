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
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0a0f0f] px-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <Mail className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Check your email
          </h1>
          <p className="mb-6 text-sm text-gray-400">
            We sent a confirmation link to <span className="font-medium text-white">{email}</span>. Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="ghost" className="text-gray-300 hover:bg-white/5 hover:text-white">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="pointer-events-none absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />

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
            Create account
          </h1>
          <p className="mb-8 text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
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
                placeholder="Min. 6 characters"
                required
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-lg border border-white/10 bg-white px-8 text-black hover:bg-gray-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500" style={{ fontFamily: "monospace" }}>
          // JOIN 10,000+ STUDENTS
        </p>
      </div>
    </div>
  );
}
