import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, CreditCard, User } from "lucide-react";

export default function MemberDashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="My Membership" description="Welcome, Amit — Here are your membership details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-primary/15 rounded-lg p-2"><Dumbbell className="h-5 w-5 text-primary" /></div>
            <CardTitle className="text-base font-display">Membership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="font-medium">Annual</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge className="bg-success/15 text-success border-success/30" variant="outline">Active</Badge></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Joined</span><span>Jan 10, 2025</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expires</span><span className="font-medium text-warning">Jan 10, 2026</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-accent/15 rounded-lg p-2"><User className="h-5 w-5 text-accent" /></div>
            <CardTitle className="text-base font-display">Trainer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium">Arjun Singh</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Specialization</span><span>Strength Training</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rating</span><span>⭐ 4.8</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-primary/15 rounded-lg p-2"><CreditCard className="h-5 w-5 text-primary" /></div>
            <CardTitle className="text-base font-display">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Jul 2025", amount: "₹12,000", status: "Paid", method: "UPI" },
                { date: "Jul 2024", amount: "₹10,000", status: "Paid", method: "Cash" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{p.date}</span>
                  </div>
                  <span className="text-sm font-medium">{p.amount}</span>
                  <span className="text-xs text-muted-foreground">{p.method}</span>
                  <Badge className="bg-success/15 text-success border-success/30" variant="outline">{p.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
