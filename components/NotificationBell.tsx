"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { toast } from "sonner";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

export default function NotificationBell() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const openDrawer = useAppointmentDrawer((s: any) => s.openDrawer);
  
  // 🔌 WebSocket Reference Pointer tracking persistent browser instance
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCount = async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(Number(count) || 0);
    } catch (error) {
      console.error("Fetch count suppressed:", error);
    }
  };

  const fetchNotificationsList = async () => {
    try {
      const data = await getNotifications(15);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to sync notifications stream snapshot:", error);
    }
  };

  const fetchUserAndConnectWS = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      setUserRole(user?.role?.toLowerCase());
      
      if (socketRef.current) {
        socketRef.current.close();
      }

      const wsUrl = `ws://localhost:8000/ws/notifications?token=${user.id}`;
      console.log(`📡 [FRONTEND WS CONNECTING] -> Target: ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 [FRONTEND WS OPEN]: Real-time delivery vector online.");
      };

      ws.onmessage = (event) => {
        console.log("\n📥 [WEBSOCKET PACKET CAPTURED] 📥");
        try {
          const freshNotification = JSON.parse(event.data);
          console.log("📦 Data Frame Content:", freshNotification);

          // Instantly bump count safely using explicit primitive conversion
          setUnreadCount((prev) => (Number(prev) || 0) + 1);
          setNotifications((prev) => [freshNotification, ...prev]);

          toast.success(freshNotification.title || "New Update!", {
            description: freshNotification.message,
            duration: 5000,
          });

        } catch (parseErr) {
          console.error("⚠️ Failed parsing live websocket message string:", parseErr);
        }
      };

      ws.onclose = () => {
        console.log("❌ [FRONTEND WS CLOSED]: Connection detached from delivery channel.");
        setTimeout(() => {
          if (mounted) {
            fetchUserAndConnectWS();
          }
        }, 5000);
      };

      ws.onerror = (err) => {
        console.error("⚠️ [FRONTEND WS ERROR DETECTED]:", err);
      };

    } catch (error) {
      console.error("User context load or WebSocket setup failed:", error);
    }
  };

  useEffect(() => {
    if (!mounted) return;

    fetchCount();
    fetchUserAndConnectWS();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [mounted]);

  const handleOpen = async (open: boolean) => {
    if (open) {
      setLoading(true);
      await fetchNotificationsList();
      setLoading(false);
    }
  };

  const extractId = (link: string) => {
    if (!link) return null;

    try {
      const urlObj = new URL(link, "http://localhost");
      
      const idFromParam =
        urlObj.searchParams.get("view") ||
        urlObj.searchParams.get("open") ||
        urlObj.searchParams.get("id");

      if (idFromParam && !isNaN(Number(idFromParam))) return idFromParam;

      const parts = urlObj.pathname.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1];

      if (lastPart && !isNaN(Number(lastPart))) return lastPart;

      return null;
    } catch {
      const queryMatch = link.match(/[?&](view|open|id)=(\d+)/);
      if (queryMatch) return queryMatch[2];

      const cleanPathMatch = link.match(/\/(?:appointments|appointment)\/(\d+)/);
      return cleanPathMatch ? cleanPathMatch[1] : null;
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

    if ((rawLink.includes("appointment") || rawLink.includes("appointments")) && targetId) {
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

  if (!mounted) return null;

  const currentCount = Number(unreadCount) || 0;

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        {/* 🛠️ FIX: Added min-w-[40px], flex-shrink-0, and explicit sizing bounds 
            to stop the button element from getting flattened on mobile screen layout shifts */}
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-black/5 transition-all focus-visible:ring-0 w-10 h-10 min-w-[40px] flex-shrink-0 flex items-center justify-center"
        >
          <Bell
            className={`h-5 w-5 transition-colors ${
              currentCount > 0 ? "text-orange-600" : "text-slate-500"
            }`}
          />

          {currentCount > 0 && (
            /* 🛠️ FIX: Boosted rendering stack to z-[120] and adjusted alignment bounds 
               to keep it pinned cleanly above the header container context layer */
            <span
              className="
                absolute top-1.5 right-1.5 z-[120]
                flex items-center justify-center
                h-4 w-4
                rounded-full
                bg-orange-600 text-white
                text-[9px] font-black leading-none
                border border-white
                pointer-events-none
                shadow-sm
              "
            >
              {currentCount > 9 ? "9+" : currentCount}
            </span>
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
            <span className="text-[10px] text-slate-400 font-medium">
              Registry Update
            </span>
          </div>

          {currentCount > 0 && (
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
              <p className="text-xs text-slate-400 font-medium italic">
                Syncing...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <Inbox className="h-8 w-8 text-slate-200" />
              <p className="text-xs font-medium text-slate-400">
                Everything caught up
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif, idx) => {
                if (!notif || !notif.created_at) return null;

                const dateStr = notif.created_at.endsWith("Z")
                  ? notif.created_at
                  : `${notif.created_at}Z`;

                const dateObj = parseISO(dateStr);
                const displayDate = isValid(dateObj)
                  ? formatDistanceToNow(dateObj, { addSuffix: true })
                  : "Just now";

                return (
                  <motion.div
                    key={notif.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <DropdownMenuItem
                      className={`p-4 cursor-pointer border-l-4 flex flex-col items-start gap-1 transition-all ${
                        notif.is_read
                          ? "border-transparent opacity-70"
                          : "border-orange-500 bg-orange-50/20"
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex justify-between w-full items-start gap-4">
                        <span className="text-[13px] font-semibold text-slate-900">
                          {notif.title}
                        </span>
                        <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                          {displayDate}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2">
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