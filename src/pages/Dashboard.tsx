import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboard from "@/components/dashboards/SuperAdminDashboard";
import GymOwnerDashboard from "@/components/dashboards/GymOwnerDashboard";
import PGOwnerDashboard from "@/components/dashboards/PGOwnerDashboard";
import TrainerDashboard from "@/components/dashboards/TrainerDashboard";
import PGManagerDashboard from "@/components/dashboards/PGManagerDashboard";
import MemberDashboard from "@/components/dashboards/MemberDashboard";
import TenantDashboard from "@/components/dashboards/TenantDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case "super_admin": return <SuperAdminDashboard />;
    case "owner": return user.businessType === "pg" ? <PGOwnerDashboard /> : <GymOwnerDashboard />;
    case "staff": return user.businessType === "pg" ? <PGManagerDashboard /> : <TrainerDashboard />;
    case "member": return <MemberDashboard />;
    case "tenant": return <TenantDashboard />;
    default: return <div>Unknown role</div>;
  }
}
