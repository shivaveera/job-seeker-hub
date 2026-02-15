import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Monthly",
    price: "$19",
    period: "/month",
    features: ["Daily job listings", "Application tracker", "Resume builder (3 resumes)", "Email support"],
    popular: false,
  },
  {
    name: "3 Months",
    price: "$49",
    period: "/3 months",
    features: ["Everything in Monthly", "Priority support", "Save $8 vs monthly", "Company insights"],
    popular: true,
  },
  {
    name: "6 Months",
    price: "$89",
    period: "/6 months",
    features: ["Everything in 3 Months", "1-on-1 resume review", "Save $25 vs monthly", "Interview prep resources"],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center gap-4 border-b border-border px-6 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F1</span>
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>F1Work</span>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your job search timeline</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border bg-card p-6 ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-6 block">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
