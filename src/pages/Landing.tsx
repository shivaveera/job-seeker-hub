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
    description:
      "Curated daily job listings filtered specifically for F1, CPT, and OPT visa holders. No more guessing which employers sponsor.",
  },
  {
    icon: Target,
    title: "Application Tracker",
    description:
      "Track every application from saved to offer. Visual pipeline so you never lose track of where you stand.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Professional LaTeX templates designed for ATS systems. Build up to 3 tailored resumes for different roles.",
  },
];

const features2 = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Live dashboards with application stats. Monitor your job search progress and optimize your strategy.",
  },
  {
    icon: Shield,
    title: "Visa Verified",
    description:
      "Every listing is screened for visa sponsorship compatibility. Apply with confidence knowing you qualify.",
  },
  {
    icon: Briefcase,
    title: "Company Insights",
    description:
      "Browse jobs grouped by company. See all open roles, company details, and hiring patterns in one place.",
  },
];

const steps = [
  {
    num: "01",
    title: "Sign Up",
    description:
      "Create your account in seconds. Choose a plan that fits your job search timeline.",
  },
  {
    num: "02",
    title: "Browse & Apply",
    description:
      "Explore daily curated jobs. Save favorites, track applications, and manage your pipeline.",
  },
  {
    num: "03",
    title: "Land Your Role",
    description:
      "Use our tools to stay organized, follow up on time, and convert applications into offers.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0f0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-sm font-bold text-white">F1</span>
          </div>
          <span
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            F1Work
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How It Works
          </a>
          <Link to="/pricing" className="transition hover:text-white">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="sm"
              className="rounded-lg border border-white/20 bg-white px-5 text-black hover:bg-gray-100"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 lg:px-16 lg:pt-32">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <h1
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The complete platform to
            <br />
            land your{" "}
            <span className="text-emerald-400">dream job.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base text-gray-400 lg:text-lg">
            Your toolkit to navigate the US job market as an international
            student. Daily curated jobs, smart tracking, and professional resume
            tools — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="rounded-lg border border-white/10 bg-white px-8 text-black hover:bg-gray-100"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-300 hover:bg-white/5 hover:text-white"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#0d1414] px-6 py-6"
            >
              <p className="text-sm text-gray-300">
                <span className="text-2xl font-bold text-white">{s.value}</span>{" "}
                {s.desc}
              </p>
              <p
                className="mt-3 text-[10px] tracking-[0.2em] text-gray-500"
                style={{ fontFamily: "monospace" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features section 1 */}
      <section id="features" className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-xs tracking-[0.2em] text-emerald-400"
            style={{ fontFamily: "monospace" }}
          >
            // PLATFORM
          </p>
          <h2
            className="mb-4 max-w-lg text-3xl font-bold leading-tight lg:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need to get hired.
          </h2>
          <p className="mb-16 max-w-xl text-base text-gray-400">
            A complete platform for F1, CPT, and OPT students. From job
            discovery to offer acceptance — we've got you covered.
          </p>

          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="border-b border-white/10 bg-[#0d1414] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <f.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          {/* Features row 2 */}
          <div className="mt-px grid gap-px overflow-hidden rounded-xl border border-white/10 md:grid-cols-3">
            {features2.map((f) => (
              <div
                key={f.title}
                className="border-b border-white/10 bg-[#0d1414] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <f.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-xs tracking-[0.2em] text-emerald-400"
            style={{ fontFamily: "monospace" }}
          >
            // HOW IT WORKS
          </p>
          <h2
            className="mb-16 max-w-lg text-3xl font-bold leading-tight lg:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Three steps to your next role.
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-white/10 bg-[#0d1414] p-8"
              >
                <span
                  className="text-sm font-bold text-emerald-400"
                  style={{ fontFamily: "monospace" }}
                >
                  {step.num}
                </span>
                <h3
                  className="mb-2 mt-3 text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-4 text-3xl font-bold lg:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to start your{" "}
            <span className="text-emerald-400">career?</span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-gray-400">
            Join thousands of international students who found their dream jobs
            through F1Work.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="rounded-lg border border-white/10 bg-white px-8 text-black hover:bg-gray-100"
            >
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          © 2026 F1Work • Built for international students
        </p>
      </footer>
    </div>
  );
}
