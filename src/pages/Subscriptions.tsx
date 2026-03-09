import { PageHeader } from "@/components/shared/PageHeader";
import { subscriptionPlans } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function Subscriptions() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Subscription Plans" description="Choose the plan that fits your business" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map(plan => (
          <Card key={plan.id} className={`shadow-card relative ${plan.popular ? "border-primary border-2" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0">Most Popular</Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold font-display">₹{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground hover:opacity-90" : ""}`} variant={plan.popular ? "default" : "outline"}>
                {plan.popular ? "Get Started" : "Choose Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
