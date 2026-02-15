import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Target, FileText, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Daily Job Listings",
    description: "Fresh F1/CPT/OPT-friendly positions updated every day from real postings.",
  },
  {
    icon: Target,
    title: "Application Tracker",
    description: "Track every application status — from saved to offer — in one place.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Professional templates designed for international student applications.",
  },
];

const stats = [
  { value: "500+", label: "Jobs Daily" },
  { value: "10K+", label: "Students" },
  { value: "95%", label: "Satisfaction" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F1</span>
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            F1Work
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center lg:py-32">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary" />
          Built for F1, CPT & OPT students
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Land your dream job in the{" "}
          <span className="text-primary">United States</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Daily curated job listings, smart application tracking, and professional resume tools — 
          everything international students need to navigate the US job market.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="px-8">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="lg">View Pricing</Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-border py-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Everything you need to get hired</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to start your career?</h2>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Join thousands of international students who found their dream jobs through F1Work.
        </p>
        <Link to="/signup">
          <Button size="lg" className="px-8">Get Started Today</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © 2026 F1Work. All rights reserved.
      </footer>
    </div>
  );
}
