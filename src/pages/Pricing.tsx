import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

const plans = [
  { name: "Monthly", price: "$19", period: "/month", features: ["Daily job listings", "Application tracker", "Resume builder (3 resumes)", "Email support"], popular: false },
  { name: "3 Months", price: "$49", period: "/3 months", features: ["Everything in Monthly", "Priority support", "Save $8 vs monthly", "Company insights"], popular: true },
  { name: "6 Months", price: "$89", period: "/6 months", features: ["Everything in 3 Months", "1-on-1 resume review", "Save $25 vs monthly", "Interview prep resources"], popular: false },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your profile. You'll retain access until the end of your billing period." },
  { q: "Do you offer refunds?", a: "We offer a full refund within 7 days of purchase if you're not satisfied." },
  { q: "What visa types are supported?", a: "We curate jobs for F1 (CPT & OPT), H1B, and other work-authorized students." },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-16 animate-in">
        <div className="flex items-center gap-4">
          <Link to="/"><Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><span className="text-sm font-bold text-primary-foreground">F1</span></div>
            <span className="text-xl font-bold tracking-tight">F1Work</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-secondary hover:text-foreground">Sign in</Button></Link>
          <Link to="/signup"><Button size="sm" className="rounded-lg bg-foreground px-5 text-background hover:bg-foreground/90">Get Started</Button></Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs tracking-[0.2em] text-primary font-mono">// PRICING</p>
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Simple, transparent pricing</h1>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">Choose the plan that fits your job search timeline. All plans include full platform access.</p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-6 pb-24 lg:px-16">
        <div className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-xl border bg-card p-8 transition-smooth hover-lift ${plan.popular ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border hover:border-primary/20"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most Popular</div>
              )}
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-8 block">
                <Button className={`w-full rounded-lg ${plan.popular ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border bg-secondary text-foreground hover:bg-accent"}`}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-primary font-mono">// FAQ</p>
          <h2 className="mb-12 text-3xl font-bold">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-6 transition-smooth hover:border-primary/20">
                <h3 className="mb-2 font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">© 2026 F1Work • Built for international students</p>
      </footer>
    </div>
  );
}
