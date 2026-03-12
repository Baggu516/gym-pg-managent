import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import { MembersProvider } from "@/contexts/MembersContext";
import { StaffProvider } from "@/contexts/StaffContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Members from "./pages/Members";
import Staff from "./pages/Staff";
import Payments from "./pages/Payments";
import Subscriptions from "./pages/Subscriptions";
import MembershipPlans from "./pages/MembershipPlans";
import Reports from "./pages/Reports";
import Rooms from "./pages/Rooms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ClientsProvider>
          <MembersProvider>
            <StaffProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/tenants" element={<Members />} />
                    <Route path="/trainers" element={<Staff />} />
                    <Route path="/managers" element={<Staff />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/membership-plans" element={<MembershipPlans />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/my-membership" element={<Dashboard />} />
                    <Route path="/my-room" element={<Dashboard />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </StaffProvider>
          </MembersProvider>
        </ClientsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
