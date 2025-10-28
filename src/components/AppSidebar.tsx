// /* eslint-disable @typescript-eslint/no-unused-vars */

// // src/components/AppSidebar.tsx
// import {
//   FileText,
//   Building2,
//   Users,
//   BarChart3,
//   Home,
//   Folder,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { useAuthContext } from "../contexts/AuthContext";
// import { useQuery } from "@tanstack/react-query";
// import { organizationService } from "../lib/api";
// import type { Organization } from "../types";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarSeparator,
//   useSidebar,
// } from "./ui/sidebar";
// import { Badge } from "./ui/badge";

// const baseItems = [
//   { title: "Dashboard", url: "/", icon: Home },
//   { title: "Documents", url: "/documents", icon: FileText },
//   { title: "Analytics", url: "/analytics", icon: BarChart3 },
// ];

// const adminItems = [
//   { title: "Organizations", url: "/organizations", icon: Building2 },
//   { title: "Users", url: "/users", icon: Users },
// ];

// export function AppSidebar() {
//   const { state } = useSidebar();
//   // const location = useLocation();
//   const { user } = useAuthContext();

//   // FIXED: Fetch orgs with documentCount from backend (no need for multi-fetch docs)
//   const { data: orgsResponse, isLoading: orgsLoading } = useQuery({
//     queryKey: ["sidebarOrgs"],
//     queryFn: () => organizationService.getOrganizations({ limit: 20 }), // Reasonable limit
//     enabled:
//       !!user &&
//       ["admin", "superadmin"].includes(user?.role.name?.toLowerCase() || ""),
//   });

//   const organizations: Organization[] = orgsResponse?.data?.organizations || [];

//   const isAdminUser = ["admin", "superadmin"].includes(
//     user?.role.name?.toLowerCase() || ""
//   );
//   console.log("AppSidebar orgs:", {
//     count: organizations.length,
//     sample: organizations[0],
//   }); // Debug

//   const allItems = isAdminUser ? [...baseItems, ...adminItems] : baseItems;

//   const getNavCls = ({ isActive }: { isActive: boolean }) =>
//     isActive
//       ? "bg-accent text-accent-foreground font-medium"
//       : "hover:bg-accent/50";

//   if (orgsLoading) {
//     console.log("AppSidebar loading orgs..."); // Debug
//   }

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>ContractHub</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {allItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <NavLink to={item.url} end className={getNavCls}>
//                     <item.icon className="mr-2 h-4 w-4" />
//                     {state !== "collapsed" && <span>{item.title}</span>}
//                   </NavLink>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* FIXED: NEW Organization Placeholder Section for Admin */}
//         {isAdminUser && organizations.length > 0 && (
//           <>
//             <SidebarSeparator />
//             <SidebarGroup>
//               <SidebarGroupLabel>Organizations</SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {organizations.slice(0, 5).map((org) => {
//                     // Limit to top 5; add "View All" if needed
//                     const orgId = org._id.toString(); // Ensure string
//                     const docCount = org.documentCount || 0; // From backend
//                     return (
//                       <SidebarMenuItem key={org._id}>
//                         <NavLink
//                           to={`/organizations/${orgId}`} // Or dashboard with org filter
//                           className={({ isActive }) =>
//                             `pl-8 ${
//                               isActive
//                                 ? "bg-accent text-accent-foreground font-medium"
//                                 : "hover:bg-accent/50"
//                             }`
//                           }
//                           title={`${org.name} (${docCount} docs)`}
//                         >
//                           <Folder className="mr-2 h-4 w-4" />
//                           {state !== "collapsed" && (
//                             <span className="flex items-center justify-between w-full">
//                               <span className="truncate">{org.name}</span>
//                               {docCount > 0 && (
//                                 <Badge
//                                   variant="secondary"
//                                   className="ml-2 text-xs"
//                                 >
//                                   {docCount}
//                                 </Badge>
//                               )}
//                             </span>
//                           )}
//                         </NavLink>
//                       </SidebarMenuItem>
//                     );
//                   })}
//                   {organizations.length > 5 && (
//                     <SidebarMenuItem>
//                       <NavLink to="/organizations" className={getNavCls}>
//                         <Building2 className="mr-2 h-4 w-4" />
//                         {state !== "collapsed" && (
//                           <span>View All ({organizations.length})</span>
//                         )}
//                       </NavLink>
//                     </SidebarMenuItem>
//                   )}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           </>
//         )}
//       </SidebarContent>
//     </Sidebar>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */

// src/components/AppSidebar.tsx
import {
  FileText,
  Building2,
  Users,
  BarChart3,
  Home,
  Folder,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { organizationService } from "../lib/api";
import type { Organization } from "../types";

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
  // const location = useLocation();
  const { user } = useAuthContext();

  // FIXED: Fetch orgs with documentCount from backend (no need for multi-fetch docs)
  const { data: orgsResponse, isLoading: orgsLoading } = useQuery({
    queryKey: ["sidebarOrgs"],
    queryFn: () => organizationService.getOrganizations({ limit: 20 }), // Reasonable limit
    enabled:
      !!user &&
      ["admin", "superadmin"].includes(user?.role.name?.toLowerCase() || ""),
  });

  const organizations: Organization[] = orgsResponse?.data?.organizations || [];

  const isAdminUser = ["admin", "superadmin"].includes(
    user?.role.name?.toLowerCase() || ""
  );
  console.log("AppSidebar orgs:", {
    count: organizations.length,
    sample: organizations[0],
  }); // Debug

  const allItems = isAdminUser ? [...baseItems, ...adminItems] : baseItems;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "hover:bg-accent/50";

  if (orgsLoading) {
    console.log("AppSidebar loading orgs..."); // Debug
  }

  return (
    <Sidebar collapsible="icon" className="w-48">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">ContractHub</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end className={getNavCls}>
                    <item.icon className="mr-2 h-3.5 w-3.5" />
                    {state !== "collapsed" && (
                      <span className="text-xs">{item.title}</span>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* FIXED: NEW Organization Placeholder Section for Admin */}
        {isAdminUser && organizations.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs">
                Organizations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {organizations.slice(0, 5).map((org) => {
                    // Limit to top 5; add "View All" if needed
                    const orgId = org._id.toString(); // Ensure string
                    const docCount = org.documentCount || 0; // From backend
                    return (
                      <SidebarMenuItem key={org._id}>
                        <NavLink
                          to={`/organizations/${orgId}`} // Or dashboard with org filter
                          className={({ isActive }) =>
                            `pl-8 ${
                              isActive
                                ? "bg-accent text-accent-foreground font-medium"
                                : "hover:bg-accent/50"
                            }`
                          }
                          title={`${org.name} (${docCount} docs)`}
                        >
                          <Folder className="mr-2 h-3.5 w-3.5" />
                          {state !== "collapsed" && (
                            <span className="flex items-center justify-between w-full text-xs">
                              <span className="truncate">{org.name}</span>
                              {docCount > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {docCount}
                                </Badge>
                              )}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    );
                  })}
                  {organizations.length > 5 && (
                    <SidebarMenuItem>
                      <NavLink to="/organizations" className={getNavCls}>
                        <Building2 className="mr-2 h-3.5 w-3.5" />
                        {state !== "collapsed" && (
                          <span className="text-xs">
                            View All ({organizations.length})
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
      </SidebarContent>
    </Sidebar>
  );
}
