import { PageHeader } from "@/components/shared/PageHeader";
import { membershipPlans } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function MembershipPlans() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Membership Plans"
        description="Prices to show members — Monthly, Quarterly, Half-yearly, Annually"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`shadow-card relative ${plan.popular ? "border-primary border-2" : ""}`}
          >
            {plan.popular && (
              <Badge
                className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0"
              >
                Best value
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.duration}</p>
              <div className="mt-2">
                <span className="text-3xl font-bold font-display">₹{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm"> total</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ₹{plan.perMonth.toLocaleString()}/month
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Full gym access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Trainer support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Valid for {plan.duration}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
