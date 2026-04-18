import {
  FileText,
  Building2,
  Users,
  BarChart3,
  Home,
  Folder,
  ChevronRight,
  Plus,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { organizationService } from "../lib/api";
import type { Organization } from "../types";
import { motion } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import { Badge } from "./ui/badge";

const baseItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const adminItems = [
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuthContext();

  const { data: orgsResponse, isLoading: orgsLoading } = useQuery({
    queryKey: ["sidebarOrgs"],
    queryFn: () => organizationService.getOrganizations({ limit: 20 }),
    enabled:
      !!user &&
      ["admin", "superadmin"].includes(user?.role.name?.toLowerCase() || ""),
  });

  const organizations: Organization[] = orgsResponse?.data?.organizations || [];

  const isAdminUser = ["admin", "superadmin"].includes(
    user?.role.name?.toLowerCase() || "",
  );

  const allItems = isAdminUser ? [...baseItems, ...adminItems] : baseItems;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
      isActive
        ? "bg-white/10 text-white ring-1 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        : "text-zinc-500 hover:text-white hover:bg-white/5"
    }`;

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl selection:bg-white/20"
    >
      <SidebarContent className="p-6 flex flex-col gap-8">
        {/* Branding Section */}
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] flex-shrink-0">
            <span className="text-black font-bold text-lg leading-none">C</span>
          </div>
          {state !== "collapsed" && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold tracking-[0.2em] uppercase text-sm"
            >
              ContractHub
            </motion.span>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 px-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end className={getNavCls}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {state !== "collapsed" && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Organizations Section */}
        {isAdminUser && (
          <>
            <SidebarSeparator className="bg-white/5" />
            <SidebarGroup className="p-0">
              <div className="flex items-center justify-between mb-4 px-2">
                <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  Organizations
                </SidebarGroupLabel>
                {state !== "collapsed" && (
                  <button className="text-zinc-600 hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {orgsLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-10 w-full bg-white/5 rounded-xl animate-pulse"
                        />
                      ))
                    : organizations.slice(0, 5).map((org) => {
                        const orgId = org._id.toString();
                        const docCount = org.documentCount || 0;
                        return (
                          <SidebarMenuItem key={org._id}>
                            <NavLink
                              to={`/organizations/${orgId}`}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                  isActive
                                    ? "bg-white/5 text-white ring-1 ring-white/10"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                                }`
                              }
                            >
                              <Folder className="h-4 w-4 flex-shrink-0" />
                              {state !== "collapsed" && (
                                <div className="flex items-center justify-between w-full min-w-0">
                                  <span className="text-sm font-medium truncate">
                                    {org.name}
                                  </span>
                                  {docCount > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 bg-white/10 text-white border-none text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] flex items-center justify-center rounded-full"
                                    >
                                      {docCount}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </NavLink>
                          </SidebarMenuItem>
                        );
                      })}
                  {organizations.length > 5 && (
                    <SidebarMenuItem>
                      <NavLink to="/organizations" className={getNavCls}>
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && (
                          <span className="text-sm font-medium flex items-center gap-2">
                            View All <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* User Profile Summary (Visible when collapsed) */}
        {state === "collapsed" && (
          <div className="mt-auto flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 shadow-lg" />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
