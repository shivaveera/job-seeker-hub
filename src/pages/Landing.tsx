import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Target,
  FileText,
  ArrowRight,
  Search,
  BarChart3,
  Shield,
  Sparkles,
} from "lucide-react";

const stats = [
  { value: "500+", desc: "jobs updated daily.", label: "LINKEDIN" },
  { value: "95%", desc: "visa-friendly positions.", label: "VERIFIED" },
  { value: "10K+", desc: "students placed.", label: "COMMUNITY" },
  { value: "3x", desc: "faster to get interviews.", label: "RESULTS" },
];

const features = [
  {
    icon: Search,
    title: "Smart Job Discovery",
    description: "Curated daily job listings filtered specifically for F1, CPT, and OPT visa holders. No more guessing which employers sponsor.",
  },
  {
    icon: Target,
    title: "Application Tracker",
    description: "Track every application from saved to offer. Visual pipeline so you never lose track of where you stand.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Professional LaTeX templates designed for ATS systems. Build up to 3 tailored resumes for different roles.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards with application stats. Monitor your job search progress and optimize your strategy.",
  },
  {
    icon: Shield,
    title: "Visa Verified",
    description: "Every listing is screened for visa sponsorship compatibility. Apply with confidence knowing you qualify.",
  },
  {
    icon: Briefcase,
    title: "Company Insights",
    description: "Browse jobs grouped by company. See all open roles, company details, and hiring patterns in one place.",
  },
];

const steps = [
  { num: "01", title: "Sign Up", description: "Create your account in seconds. Choose a plan that fits your job search timeline." },
  { num: "02", title: "Browse & Apply", description: "Explore daily curated jobs. Save favorites, track applications, and manage your pipeline." },
  { num: "03", title: "Land Your Role", description: "Use our tools to stay organized, follow up on time, and convert applications into offers." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-16 animate-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F1</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">F1Work</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-smooth hover:text-foreground">Features</a>
          <a href="#how-it-works" className="transition-smooth hover:text-foreground">How It Works</a>
          <Link to="/pricing" className="transition-smooth hover:text-foreground">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-secondary hover:text-foreground">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="rounded-lg bg-foreground px-5 text-background hover:bg-foreground/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 lg:px-16 lg:pt-32">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Pill badge */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground animate-in opacity-0" style={{ animationDelay: "0.1s" }}>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>New: AI-powered resume tailoring coming soon</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl animate-in opacity-0" style={{ animationDelay: "0.2s" }}>
            The complete platform to<br />land your <span className="text-primary">dream job.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground lg:text-lg animate-in opacity-0" style={{ animationDelay: "0.3s" }}>
            Your toolkit to navigate the US job market as an international student. Daily curated jobs, smart tracking, and professional resume tools — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 animate-in opacity-0" style={{ animationDelay: "0.4s" }}>
            <Link to="/signup">
              <Button size="lg" className="rounded-lg bg-foreground px-8 text-background hover:bg-foreground/90 hover-lift">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:bg-secondary hover:text-foreground">View Pricing</Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4 animate-in opacity-0" style={{ animationDelay: "0.5s" }}>
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-6 py-6 transition-smooth hover:bg-accent/30">
              <p className="text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{s.value}</span>{" "}{s.desc}
              </p>
              <p className="mt-3 text-[10px] tracking-[0.2em] text-muted-foreground/60 font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-primary font-mono">// PLATFORM</p>
          <h2 className="mb-4 max-w-lg text-3xl font-bold leading-tight lg:text-5xl">Everything you need to get hired.</h2>
          <p className="mb-16 max-w-xl text-base text-muted-foreground">
            A complete platform for F1, CPT, and OPT students. From job discovery to offer acceptance — we've got you covered.
          </p>

          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="bg-card p-8 transition-smooth hover:bg-accent/20 group">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-smooth group-hover:bg-primary/20 group-hover:border-primary/40">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-primary font-mono">// HOW IT WORKS</p>
          <h2 className="mb-16 max-w-lg text-3xl font-bold leading-tight lg:text-5xl">Three steps to your next role.</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="rounded-xl border border-border bg-card p-8 hover-lift group">
                <span className="text-sm font-bold text-primary font-mono">{step.num}</span>
                <h3 className="mb-2 mt-3 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-primary font-mono">// PRICING</p>
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl">Simple, transparent pricing.</h2>
          <p className="mx-auto mb-6 max-w-xl text-base text-muted-foreground">
            Starting at <span className="text-foreground font-semibold">$9.99/month</span>. No hidden fees, cancel anytime.
          </p>
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="hover-lift">View All Plans <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center lg:p-16">
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl">
            Ready to start your <span className="text-primary">career?</span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground">
            Join thousands of international students who found their dream jobs through F1Work.
          </p>
          <Link to="/signup">
            <Button size="lg" className="rounded-lg bg-foreground px-8 text-background hover:bg-foreground/90 hover-lift">
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">© 2026 F1Work • Built for international students</p>
      </footer>
    </div>
  );
}
