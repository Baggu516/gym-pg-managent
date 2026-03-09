import { Dumbbell, LayoutDashboard, Users, UserCog, CreditCard, Crown, BarChart3, Building2, BedDouble, ClipboardList, LogOut, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["super_admin", "owner", "staff", "member", "tenant"] },
  { title: "Clients", url: "/clients", icon: Building2, roles: ["super_admin"] },
  { title: "Subscriptions", url: "/subscriptions", icon: Crown, roles: ["super_admin", "owner"] },
  { title: "Members", url: "/members", icon: Users, roles: ["owner", "staff"] },
  { title: "Trainers", url: "/trainers", icon: Dumbbell, roles: ["owner"] },
  { title: "Tenants", url: "/tenants", icon: Users, roles: ["owner", "staff"] },
  { title: "Rooms", url: "/rooms", icon: BedDouble, roles: ["owner", "staff"] },
  { title: "Managers", url: "/managers", icon: UserCog, roles: ["owner"] },
  { title: "Payments", url: "/payments", icon: CreditCard, roles: ["super_admin", "owner", "staff", "member", "tenant"] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: ["super_admin", "owner"] },
  { title: "My Membership", url: "/my-membership", icon: ClipboardList, roles: ["member"] },
  { title: "My Room", url: "/my-room", icon: BedDouble, roles: ["tenant"] },
];

export function AppSidebar() {
  const { user, logout, switchRole } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (!user) return null;

  const filteredItems = navItems.filter(item => {
    if (!item.roles.includes(user.role)) return false;
    // Filter gym-specific items for PG users and vice versa
    if (user.businessType === "pg" && ["Members", "Trainers"].includes(item.title)) return false;
    if (user.businessType === "gym" && ["Tenants", "Rooms", "Managers"].includes(item.title)) return false;
    return true;
  });

  const roleLabel = user.role === "super_admin" ? "Super Admin" :
    user.role === "owner" ? `Owner (${user.businessType === "gym" ? "Gym" : "PG"})` :
    user.role === "staff" ? (user.businessType === "gym" ? "Trainer" : "Manager") :
    user.role === "member" ? "Member" : "Tenant";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-4">
              <div className="gradient-primary rounded-lg p-1.5">
                <Dumbbell className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold font-display text-sidebar-primary-foreground">GymFlow</p>
                <p className="text-[10px] text-sidebar-foreground">& PGManager</p>
              </div>
            </div>
          )}
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <div className="px-3 pb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sidebar-primary-foreground truncate">{user.name}</p>
                    <p className="text-[10px] text-sidebar-foreground truncate">{roleLabel}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-sidebar-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-xs font-semibold text-muted-foreground" disabled>Switch Role (Demo)</DropdownMenuItem>
                {[
                  { label: "Super Admin", role: "super_admin" as const },
                  { label: "Gym Owner", role: "owner" as const, bt: "gym" as const },
                  { label: "PG Owner", role: "owner" as const, bt: "pg" as const },
                  { label: "Trainer", role: "staff" as const, bt: "gym" as const },
                  { label: "PG Manager", role: "staff" as const, bt: "pg" as const },
                  { label: "Member", role: "member" as const, bt: "gym" as const },
                  { label: "Tenant", role: "tenant" as const, bt: "pg" as const },
                ].map(r => (
                  <DropdownMenuItem key={r.label} onClick={() => switchRole(r.role, r.bt)}>
                    {r.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
