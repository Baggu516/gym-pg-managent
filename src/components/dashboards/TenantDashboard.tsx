import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Calendar, CreditCard, MapPin } from "lucide-react";

export default function TenantDashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="My Room" description="Welcome, Vikram — Here are your stay details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-primary/15 rounded-lg p-2"><BedDouble className="h-5 w-5 text-primary" /></div>
            <CardTitle className="text-base font-display">Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Room</span><span className="font-medium">101</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type</span><span>Single</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Floor</span><span>1st Floor</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Monthly Rent</span><span className="font-medium">₹8,000</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-accent/15 rounded-lg p-2"><MapPin className="h-5 w-5 text-accent" /></div>
            <CardTitle className="text-base font-display">Stay Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">PG Name</span><span className="font-medium">Comfort PG</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Joined</span><span>Mar 1, 2025</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><Badge className="bg-success/15 text-success border-success/30" variant="outline">Active</Badge></div>
          </CardContent>
        </Card>
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="bg-primary/15 rounded-lg p-2"><CreditCard className="h-5 w-5 text-primary" /></div>
            <CardTitle className="text-base font-display">Rent Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Aug 2025", amount: "₹8,000", status: "Paid", method: "Bank Transfer" },
                { date: "Jul 2025", amount: "₹8,000", status: "Paid", method: "UPI" },
                { date: "Jun 2025", amount: "₹8,000", status: "Paid", method: "UPI" },
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
