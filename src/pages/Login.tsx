import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dumbbell, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    navigate("/dashboard");
  };

  const quickLogin = async (email: string) => {
    setLoading(true);
    const result = await login(email, "demo");
    setLoading(false);
    if (!result.ok) {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-sidebar-foreground/20"
              style={{ width: `${200 + i * 120}px`, height: `${200 + i * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="gradient-primary rounded-xl p-3">
              <Dumbbell className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-display text-sidebar-primary-foreground mb-4">
            GymFlow <span className="text-primary">&</span> PGManager
          </h1>
          <p className="text-lg text-sidebar-foreground leading-relaxed">
            The all-in-one SaaS platform for managing Gym businesses and PG accommodations. Multi-tenant, role-based, powerful.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[{ label: "Clients", value: "150+" }, { label: "Members", value: "10K+" }, { label: "Uptime", value: "99.9%" }].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold font-display text-primary">{s.value}</p>
                <p className="text-sm text-sidebar-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="gradient-primary rounded-lg p-2"><Dumbbell className="h-5 w-5 text-primary-foreground" /></div>
            <h2 className="text-xl font-bold font-display">GymFlow & PGManager</h2>
          </div>

          <h2 className="text-2xl font-bold font-display mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground mb-2 text-center">Demo accounts use password: <span className="font-medium text-foreground">demo</span></p>
            <p className="text-xs text-muted-foreground mb-3 text-center">Quick demo access:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Super Admin", email: "admin@gymflow.io" },
                { label: "Gym Owner", email: "rajesh@fitzone.com" },
                { label: "PG Owner", email: "priya@comfortpg.com" },
                { label: "Trainer", email: "arjun@fitzone.com" },
                { label: "Member", email: "amit@gmail.com" },
                { label: "PG Tenant", email: "vikram@gmail.com" },
              ].map(d => (
                <Button key={d.label} variant="outline" size="sm" className="text-xs" onClick={() => quickLogin(d.email)}>
                  {d.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
