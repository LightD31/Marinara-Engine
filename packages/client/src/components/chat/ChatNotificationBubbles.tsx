// ──────────────────────────────────────────────
// Floating avatar notification bubbles
// ──────────────────────────────────────────────
// When a character messages in another conversation, their avatar appears
// as a floating circle on the left edge with a red unread badge.
// Click → navigate to that conversation. X → dismiss.

import { X, MessageCircle } from "lucide-react";
import { useChatStore } from "../../stores/chat.store";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function ChatNotificationBubbles() {
  const chatNotifications = useChatStore((s) => s.chatNotifications);
  const setActiveChatId = useChatStore((s) => s.setActiveChatId);
  const dismissNotification = useChatStore((s) => s.dismissNotification);

  const notifications = Array.from(chatNotifications.values());

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.chatId}
            initial={{ x: -60, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -60, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto group relative"
          >
            {/* Dismiss button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissNotification(notif.chatId);
              }}
              className={cn(
                "absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full",
                "bg-[var(--background)] text-[var(--foreground)]/60 shadow-md ring-1 ring-[var(--foreground)]/10",
                "transition-opacity hover:text-[var(--foreground)]",
                // Desktop: visible on hover. Mobile: always visible
                "opacity-0 group-hover:opacity-100 max-md:opacity-100",
              )}
            >
              <X className="h-3 w-3" />
            </button>

            {/* Avatar bubble */}
            <button
              onClick={() => setActiveChatId(notif.chatId)}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full",
                "bg-[var(--accent)]/20 shadow-lg ring-2 ring-[var(--accent)]/40",
                "transition-transform hover:scale-110 active:scale-95",
              )}
              title={`${notif.characterName} sent a message`}
            >
              {notif.avatarUrl ? (
                <img
                  src={notif.avatarUrl}
                  alt={notif.characterName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
              )}
            </button>

            {/* Red unread badge */}
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                "bg-red-500 text-[10px] font-bold text-white shadow",
              )}
            >
              {notif.count > 99 ? "99+" : notif.count}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
