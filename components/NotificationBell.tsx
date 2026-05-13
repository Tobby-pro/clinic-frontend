// components/NotificationBell.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { 
  getUnreadNotificationCount, 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  getCurrentUser,
  getAppointmentById
} from "@/services/api";

import { useAppointmentDrawer } from "../app/store/useAppointmentDrawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 

import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; 
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

export default function NotificationBell() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // ✅ FIX: prevent hydration mismatch
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const openDrawer = useAppointmentDrawer((s: any) => s.openDrawer);

  useEffect(() => {
    setMounted(true); // ✅ FIX: ensure client-only render
  }, []);

  const fetchCount = async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Fetch count suppressed:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setUserRole(user?.role?.toLowerCase());
    } catch (error) {
      console.error("User context failed:", error);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchCount();
    fetchUser();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  const handleOpen = async (open: boolean) => {
    if (open) {
      setLoading(true);
      try {
        const data = await getNotifications(15);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const extractId = (link: string) => {
    if (!link) return null;
    try {
      const urlObj = new URL(link, "http://localhost"); 
      const idFromParam = urlObj.searchParams.get("view") || 
                          urlObj.searchParams.get("open") || 
                          urlObj.searchParams.get("id");
      
      if (idFromParam && !isNaN(Number(idFromParam))) return idFromParam;

      const parts = urlObj.pathname.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1];
      
      if (lastPart && !isNaN(Number(lastPart))) return lastPart;

      return null;
    } catch (e) {
      const match = link.match(/[?&](view|open|id)=(\d+)/);
      return match ? match[2] : null;
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      try {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        await markNotificationRead(notif.id);
        fetchCount();
      } catch (error) {
        console.error("Error marking read:", error);
      }
    }

    const rawLink = notif.link || "";
    const targetId = extractId(rawLink);

    if (rawLink.includes("appointment") && targetId) {
      try {
        const appt = await getAppointmentById(targetId);
        if (appt) {
          openDrawer(appt);
          return; 
        }
      } catch (err) {
        console.error("❌ FAILED TO FETCH APPT:", err);
      }
    }

    let finalPath = rawLink;
    if (userRole === "admin" && rawLink.startsWith("/admin")) {
      finalPath = rawLink.replace("/admin", "/dashboard");
    } else if (userRole === "patient" && rawLink.startsWith("/admin")) {
      finalPath = "/patient/dashboard";
    }

    if (finalPath) router.push(finalPath);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      toast.success("Notifications marked as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  if (!mounted) return null; // ✅ FIX: prevents SSR mismatch

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-black/5 transition-all focus-visible:ring-0"
        >
          <Bell
            className={`h-5 w-5 transition-colors ${
              unreadCount > 0 ? "text-orange-600" : "text-slate-500"
            }`}
          />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-[10px] font-medium bg-orange-600 text-white border-2 border-white rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 rounded-2xl shadow-xl border-slate-200 p-0 overflow-hidden bg-white z-[120]"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-50 bg-slate-50/50">
          <div className="flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Notifications
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Registry Update</span>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] font-semibold text-orange-600 h-8 px-3 rounded-lg hover:bg-orange-50"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAll();
              }}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium italic">Syncing...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <Inbox className="h-8 w-8 text-slate-200" />
              <p className="text-xs font-medium text-slate-400">Everything caught up</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif, idx) => {
                const dateStr = notif.created_at.endsWith("Z") ? notif.created_at : `${notif.created_at}Z`;
                const dateObj = parseISO(dateStr);
                const displayDate = isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : "Just now";
                
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, ease: "easeOut" }}
                  >
                    <DropdownMenuItem
                      className={`p-4 cursor-pointer border-l-4 flex flex-col items-start gap-1 transition-all ${
                        notif.is_read ? "border-transparent opacity-70" : "border-orange-500 bg-orange-50/20"
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex justify-between w-full items-start gap-4">
                        <span className="text-[13px] font-semibold leading-tight text-slate-900">
                          {notif.title}
                        </span>
                        <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                          {displayDate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                        {notif.message}
                      </p>
                    </DropdownMenuItem>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}