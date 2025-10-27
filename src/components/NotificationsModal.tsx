// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../components/ui/dialog";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Bell, AlertTriangle, Activity } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { documentService, authService } from "../lib/api";
// import { useAuthContext } from "../contexts/AuthContext";
// import { toast } from "sonner";
// import type { Notification, Alert } from "../types";

// interface NotificationsModalProps {
//   unreadCount: number;
// }

// const NotificationsModal = ({ unreadCount }: NotificationsModalProps) => {
//   const { user } = useAuthContext();
//   const [open, setOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"notifications" | "alerts" | "auditlogs">("notifications");
//   const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
//   const [auditPage, setAuditPage] = useState(1);
//   const [auditLogs, setAuditLogs] = useState<any[]>([]);

//   const { data: notificationsData, refetch: refetchNotifications } = useQuery({
//     queryKey: ["notifications", user?.organization],
//     queryFn: () => documentService.getNotifications(user?.organization || ""),
//     enabled: !!user?.organization,
//     onSuccess: () => {
//       setReadNotifications(new Set());
//     },
//   });

//   // UPDATED: Use global alerts endpoint (no orgId needed)
//   const { data: alertsData } = useQuery({
//     queryKey: ["globalAlerts"],
//     queryFn: () => documentService.getGlobalExpiryAlerts(),
//     enabled: !!user,
//   });

//   // NEW: Audit logs query - Paginated, lazy load only when tab is active
//   const { data: auditLogsData, isLoading: isAuditLogsLoading, refetch: refetchAuditLogs } = useQuery({
//     queryKey: ["auditLogs", { page: auditPage }],
//     queryFn: () => authService.getAuditLogs({ page: auditPage, limit: 20 }),
//     enabled: !!user && activeTab === "auditlogs",
//     refetchOnWindowFocus: false,
//     staleTime: 5 * 60 * 1000, // 5 minutes stale time
//   });

//   // Append new logs to existing when loading next page
//   useEffect(() => {
//     if (auditLogsData?.data?.auditLogs) {
//       if (auditPage === 1) {
//         setAuditLogs(auditLogsData.data.auditLogs);
//       } else {
//         setAuditLogs(prev => [...prev, ...auditLogsData.data.auditLogs]);
//       }
//     }
//   }, [auditLogsData, auditPage]);

//   const pagination = auditLogsData?.data?.pagination || { totalPages: 0, hasNext: false };

//   const notifications: Notification[] = notificationsData?.data?.notifications || [];
//   const alerts: Alert[] = alertsData?.data?.alerts || [];

//   const formatRelativeTime = (dateString: string) => {
//     const now = new Date();
//     const createdAt = new Date(dateString);
//     const diffMs = now.getTime() - createdAt.getTime();
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffHours < 1) return "Just now";
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
//   };

//   const getAlertDisplay = (alert: Alert) => {
//     let message: string;
//     let subText: string;
//     let iconVariant: "destructive" | "warning" | "secondary" | "accent";
//     let borderClass: string;

//     if (alert.alertType === "expiry") {
//       const days = alert.daysToExpiry || 0;
//       message = `${alert.name} (${alert.documentType})`;
//       subText = `Expires in ${days} day${days !== 1 ? 's' : ''} (${new Date(alert.expiryDate).toLocaleDateString()})`;
//       iconVariant = alert.flagColor === "red" ? "destructive" : alert.flagColor === "orange" ? "warning" : "accent";
//       borderClass = alert.flagColor === "red" ? "border-destructive" : alert.flagColor === "orange" ? "border-warning" : "border-accent";
//     } else {
//       const days = alert.daysSinceUpload || 0;
//       message = `New ${alert.documentType}: ${alert.name}`;
//       subText = `${days} day${days !== 1 ? 's' : ''} ago (${new Date(alert.createdAt).toLocaleDateString()})`;
//       iconVariant = "secondary";
//       borderClass = "border-secondary";
//     }

//     return { message, subText, iconVariant, borderClass };
//   };

//   const handleMarkAsRead = (notificationId: string) => {
//     setReadNotifications(prev => new Set([...prev, notificationId]));
//     toast.success("Marked as read");
//   };

//   const handleViewNotification = (notification: Notification) => {
//     if (notification.metadata?.documentId) {
//       window.location.href = `/documents/${notification.organization._id}`;
//     }
//     handleMarkAsRead(notification._id);
//     setOpen(false);
//   };

//   const handleViewAlert = (alert: Alert) => {
//     window.location.href = `/documents/${alert.organization}`;
//     setOpen(false);
//   };

//   const handleMarkAllAsRead = () => {
//     notifications.forEach(notif => !readNotifications.has(notif._id) && handleMarkAsRead(notif._id));
//     toast.success("All notifications marked as read");
//   };

//   const unreadNotificationsCount = notifications.filter(notif => !notif.read && !readNotifications.has(notif._id)).length;

//   const loadMoreAuditLogs = () => {
//     if (pagination.hasNext) {
//       setAuditPage(prev => prev + 1);
//     }
//   };

//   const resetAuditLogs = () => {
//     setAuditPage(1);
//     setAuditLogs([]);
//   };

//   // Reset audit logs when switching tabs
//   useEffect(() => {
//     if (activeTab !== "auditlogs") {
//       resetAuditLogs();
//     }
//   }, [activeTab]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="ghost" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Notifications & Alerts</DialogTitle>
//           <DialogDescription>
//             Stay updated with document activities, expiry reminders, and audit logs
//           </DialogDescription>
//         </DialogHeader>
//         <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "notifications" | "alerts" | "auditlogs")}>
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="notifications">
//               <Bell className="mr-2 h-4 w-4" />
//               Notifications ({notifications.length})
//               {unreadNotificationsCount > 0 && <Badge variant="destructive" className="ml-1">{unreadNotificationsCount}</Badge>}
//             </TabsTrigger>
//             <TabsTrigger value="alerts">
//               <AlertTriangle className="mr-2 h-4 w-4" />
//               Alerts ({alerts.length})
//             </TabsTrigger>
//             <TabsTrigger value="auditlogs">
//               <Activity className="mr-2 h-4 w-4" />
//               Audit Logs {isAuditLogsLoading ? '(Loading...)' : `(${auditLogs.length})`}
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="notifications" className="mt-4 space-y-3">
//             {notifications.map((notification) => {
//               const isRead = readNotifications.has(notification._id);
//               const unread = !notification.read && !isRead;

//               return (
//                 <div
//                   key={notification._id}
//                   className={`
//                     w-full bg-background rounded-lg p-4 cursor-pointer transition-all
//                     hover:bg-muted border
//                     ${unread ? 'border-destructive/30 shadow-md' : 'border-border'}
//                     ${isRead ? 'opacity-75' : ''}
//                   `}
//                   onClick={() => handleViewNotification(notification)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 mt-1">
//                       <div
//                         className={`
//                           w-2.5 h-2.5 rounded-full
//                           ${unread ? 'bg-destructive' : 'bg-muted-foreground'}
//                         `}
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm leading-5 text-foreground line-clamp-2 mb-1">
//                         {notification.message}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formatRelativeTime(notification.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 mt-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleViewNotification(notification);
//                       }}
//                     >
//                       View
//                     </Button>
//                     {unread && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleMarkAsRead(notification._id);
//                         }}
//                       >
//                         Mark as read
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//             {notifications.length === 0 && (
//               <p className="text-center text-muted-foreground py-8">No notifications yet.</p>
//             )}
//             {unreadNotificationsCount > 0 && (
//               <div className="flex justify-end pt-4 border-t">
//                 <Button variant="outline" onClick={handleMarkAllAsRead}>
//                   Mark all as read
//                 </Button>
//               </div>
//             )}
//           </TabsContent>
//           <TabsContent value="alerts" className="mt-4 space-y-3">
//             {alerts.map((alert) => {
//               const { message, subText, iconVariant, borderClass } = getAlertDisplay(alert);

//               return (
//                 <div
//                   key={alert._id}
//                   className={`
//                     w-full bg-background rounded-lg p-4 cursor-pointer transition-all 
//                     hover:bg-muted border ${borderClass}/30 shadow-md
//                   `}
//                   onClick={() => handleViewAlert(alert)}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 mt-1">
//                       <AlertTriangle className={`h-5 w-5 text-${iconVariant}`} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-foreground mb-1">
//                         {message}
//                       </p>
//                       <p className="text-xs text-muted-foreground mb-1">
//                         {subText}
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <Badge variant={alert.flagColor as any} className="text-xs">
//                           {alert.alertType.toUpperCase()}
//                         </Badge>
//                         <span className="text-xs text-muted-foreground">
//                           Uploaded by: {alert.uploadedBy}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 mt-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleViewAlert(alert);
//                       }}
//                     >
//                       View Document
//                     </Button>
//                   </div>
//                 </div>
//               );
//             })}
//             {alerts.length === 0 && (
//               <p className="text-center text-muted-foreground py-8">No alerts at this time.</p>
//             )}
//           </TabsContent>
//           {/* NEW: Audit Logs Tab */}
//           <TabsContent value="auditlogs" className="mt-4 space-y-3">
//             {isAuditLogsLoading && auditPage === 1 ? (
//               <div className="flex items-center justify-center py-8">
//                 <Activity className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
//                 <span className="text-muted-foreground">Loading audit logs...</span>
//               </div>
//             ) : (
//               <>
//                 {auditLogs.map((log) => (
//                   <div
//                     key={log._id}
//                     className="w-full bg-background rounded-lg p-4 transition-all hover:bg-muted border border-border"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 mt-1">
//                         <Activity className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm leading-5 text-foreground line-clamp-2 mb-1">
//                           {log.action} - {log.resource} ({log.resourceId})
//                         </p>
//                         <p className="text-xs text-muted-foreground mb-1">
//                           {formatRelativeTime(log.createdAt)}
//                         </p>
//                         {log.user && (
//                           <p className="text-xs text-muted-foreground mt-1">
//                             By: {log.user.fullName || log.user.email}
//                           </p>
//                         )}
//                         {log.details && (
//                           <details className="mt-2 text-xs text-muted-foreground">
//                             <summary className="cursor-pointer underline">Details</summary>
//                             <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">{JSON.stringify(log.details, null, 2)}</pre>
//                           </details>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {auditLogs.length === 0 && !isAuditLogsLoading && (
//                   <p className="text-center text-muted-foreground py-8">No audit logs yet.</p>
//                 )}
//                 {pagination.hasNext && (
//                   <div className="flex justify-center pt-4 border-t">
//                     <Button
//                       variant="outline"
//                       onClick={loadMoreAuditLogs}
//                       disabled={isAuditLogsLoading}
//                     >
//                       {isAuditLogsLoading ? 'Loading...' : 'Load More'}
//                     </Button>
//                   </div>
//                 )}
//                 {pagination.totalPages > 0 && (
//                   <div className="text-center text-xs text-muted-foreground pt-2">
//                     Page {auditPage} of {pagination.totalPages} ({pagination.total} total)
//                   </div>
//                 )}
//               </>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NotificationsModal;

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Bell, AlertTriangle, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { documentService, authService } from "../lib/api";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "sonner";
import type { Notification, Alert } from "../types";

interface NotificationsModalProps {
  unreadCount: number;
}

const NotificationsModal = ({ unreadCount }: NotificationsModalProps) => {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"notifications" | "alerts" | "auditlogs">("notifications");
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [auditPage, setAuditPage] = useState(1);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", user?.organization],
    queryFn: () => documentService.getNotifications(user?.organization || ""),
    enabled: !!user?.organization,
  });

  // Handle success side effect with useEffect
  useEffect(() => {
    if (notificationsData) {
      setReadNotifications(new Set());
    }
  }, [notificationsData]);

  // UPDATED: Use global alerts endpoint (no orgId needed)
  const { data: alertsData } = useQuery({
    queryKey: ["globalAlerts"],
    queryFn: () => documentService.getGlobalExpiryAlerts(),
    enabled: !!user,
  });

  // NEW: Audit logs query - Paginated, lazy load only when tab is active
  const { data: auditLogsData, isLoading: isAuditLogsLoading } = useQuery({
    queryKey: ["auditLogs", { page: auditPage }],
    queryFn: () => authService.getAuditLogs({ page: auditPage, limit: 20 }),
    enabled: !!user && activeTab === "auditlogs",
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });

  // Append new logs to existing when loading next page
  useEffect(() => {
    if (auditLogsData?.data?.auditLogs) {
      if (auditPage === 1) {
        setAuditLogs(auditLogsData.data.auditLogs);
      } else {
        setAuditLogs(prev => [...prev, ...auditLogsData.data.auditLogs]);
      }
    }
  }, [auditLogsData, auditPage]);

  const pagination = auditLogsData?.data?.pagination || { totalPages: 0, hasNext: false };

  const notifications: Notification[] = notificationsData?.data?.notifications || [];
  const alerts: Alert[] = alertsData?.data?.alerts || [];

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getAlertDisplay = (alert: Alert) => {
    let message: string;
    let subText: string;
    let iconVariant: "destructive" | "warning" | "secondary" | "accent";
    let borderClass: string;

    if (alert.alertType === "expiry") {
      const days = alert.daysToExpiry || 0;
      message = `${alert.name} (${alert.documentType})`;
      subText = `Expires in ${days} day${days !== 1 ? 's' : ''} (${new Date(alert.expiryDate || Date.now()).toLocaleDateString()})`;
      iconVariant = alert.flagColor === "red" ? "destructive" : alert.flagColor === "orange" ? "warning" : "accent";
      borderClass = alert.flagColor === "red" ? "border-destructive" : alert.flagColor === "orange" ? "border-warning" : "border-accent";
    } else {
      const days = alert.daysSinceUpload || 0;
      message = `New ${alert.documentType}: ${alert.name}`;
      subText = `${days} day${days !== 1 ? 's' : ''} ago (${new Date(alert.createdAt || Date.now()).toLocaleDateString()})`;
      iconVariant = "secondary";
      borderClass = "border-secondary";
    }

    return { message, subText, iconVariant, borderClass };
  };

  const handleMarkAsRead = (notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
    toast.success("Marked as read");
  };

  const handleViewNotification = (notification: Notification) => {
    if (notification.metadata?.documentId && notification.organization?._id) {
      window.location.href = `/documents/${notification.organization._id}`;
    }
    handleMarkAsRead(notification._id);
    setOpen(false);
  };

  const handleViewAlert = (alert: Alert) => {
    if (alert.organization) {
      window.location.href = `/documents/${alert.organization}`;
    }
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notif => !readNotifications.has(notif._id) && handleMarkAsRead(notif._id));
    toast.success("All notifications marked as read");
  };

  const unreadNotificationsCount = notifications.filter(notif => !notif.read && !readNotifications.has(notif._id)).length;

  const loadMoreAuditLogs = () => {
    if (pagination.hasNext) {
      setAuditPage(prev => prev + 1);
    }
  };

  const resetAuditLogs = () => {
    setAuditPage(1);
    setAuditLogs([]);
  };

  // Reset audit logs when switching tabs
  useEffect(() => {
    if (activeTab !== "auditlogs") {
      resetAuditLogs();
    }
  }, [activeTab]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notifications & Alerts</DialogTitle>
          <DialogDescription>
            Stay updated with document activities, expiry reminders, and audit logs
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "notifications" | "alerts" | "auditlogs")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications ({notifications.length})
              {unreadNotificationsCount > 0 && <Badge variant="destructive" className="ml-1">{unreadNotificationsCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="auditlogs">
              <Activity className="mr-2 h-4 w-4" />
              Audit Logs {isAuditLogsLoading ? '(Loading...)' : `(${auditLogs.length})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notifications" className="mt-4 space-y-3">
            {notifications.map((notification) => {
              const isRead = readNotifications.has(notification._id);
              const unread = !notification.read && !isRead;

              return (
                <div
                  key={notification._id}
                  className={`
                    w-full bg-background rounded-lg p-4 cursor-pointer transition-all
                    hover:bg-muted border
                    ${unread ? 'border-destructive/30 shadow-md' : 'border-border'}
                    ${isRead ? 'opacity-75' : ''}
                  `}
                  onClick={() => handleViewNotification(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`
                          w-2.5 h-2.5 rounded-full
                          ${unread ? 'bg-destructive' : 'bg-muted-foreground'}
                        `}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-5 text-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewNotification(notification);
                      }}
                    >
                      View
                    </Button>
                    {unread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id);
                        }}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No notifications yet.</p>
            )}
            {unreadNotificationsCount > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="alerts" className="mt-4 space-y-3">
            {alerts.map((alert) => {
              const { message, subText, iconVariant, borderClass } = getAlertDisplay(alert);

              return (
                <div
                  key={alert._id}
                  className={`
                    w-full bg-background rounded-lg p-4 cursor-pointer transition-all 
                    hover:bg-muted border ${borderClass}/30 shadow-md
                  `}
                  onClick={() => handleViewAlert(alert)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <AlertTriangle className={`h-5 w-5 text-${iconVariant}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {message}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {subText}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.flagColor as any} className="text-xs">
                          {alert.alertType.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Uploaded by: {alert.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAlert(alert);
                      }}
                    >
                      View Document
                    </Button>
                  </div>
                </div>
              );
            })}
            {alerts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No alerts at this time.</p>
            )}
          </TabsContent>
          {/* NEW: Audit Logs Tab */}
          <TabsContent value="auditlogs" className="mt-4 space-y-3">
            {isAuditLogsLoading && auditPage === 1 ? (
              <div className="flex items-center justify-center py-8">
                <Activity className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Loading audit logs...</span>
              </div>
            ) : (
              <>
                {auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="w-full bg-background rounded-lg p-4 transition-all hover:bg-muted border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-5 text-foreground line-clamp-2 mb-1">
                          {log.action} - {log.resource} ({log.resourceId})
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {formatRelativeTime(log.createdAt)}
                        </p>
                        {log.user && (
                          <p className="text-xs text-muted-foreground mt-1">
                            By: {log.user.fullName || log.user.email}
                          </p>
                        )}
                        {log.details && (
                          <details className="mt-2 text-xs text-muted-foreground">
                            <summary className="cursor-pointer underline">Details</summary>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">{JSON.stringify(log.details, null, 2)}</pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && !isAuditLogsLoading && (
                  <p className="text-center text-muted-foreground py-8">No audit logs yet.</p>
                )}
                {pagination.hasNext && (
                  <div className="flex justify-center pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={loadMoreAuditLogs}
                      disabled={isAuditLogsLoading}
                    >
                      {isAuditLogsLoading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
                {pagination.totalPages > 0 && (
                  <div className="text-center text-xs text-muted-foreground pt-2">
                    Page {auditPage} of {pagination.totalPages} ({'total' in pagination ? pagination.total : 0} total)
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;