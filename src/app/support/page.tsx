"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { openCookiePreferences } from "@/lib/cookie-consent";

type SupportThreadItem = {
  id: string;
  customer_id: string;
  customer_email?: string;
  order_id?: string | null;
  subject: string;
  status: "open" | "in_progress" | "closed";
  assigned_admin_id?: string | null;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
};

type SupportMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  created_at: string;
};

type SupportThreadDetail = {
  thread: SupportThreadItem;
  messages: SupportMessage[];
};

type HelpItem = {
  id: string;
  title: string;
  body: string;
};

const HELP_ITEMS: HelpItem[] = [
  {
    id: "help-center",
    title: "Help Center",
    body: "Find answers to common marketplace questions, support steps, and what to do when an order or payment needs attention.",
  },
  {
    id: "place-order",
    title: "Place an order",
    body: "Browse products, add items to cart, review your checkout summary, and complete payment using the provided marketplace payment instructions.",
  },
  {
    id: "payment-options",
    title: "Payment options",
    body: "RHOVIC currently supports manual bank transfer. After checkout, use the provided account details and payment reference, then upload proof of payment from your order page.",
  },
  {
    id: "track-order",
    title: "Track an order",
    body: "Use My Orders to view payment status, proof review status, and order progress after admin approval and vendor fulfillment updates.",
  },
  {
    id: "cancel-order",
    title: "Cancel an order",
    body: "If your order has not moved too far in processing, contact support with your order ID and reason. The team will review and guide you on the next step.",
  },
  {
    id: "returns",
    title: "Returns & refunds",
    body: "If you received the wrong item, damaged goods, or a product that materially differs from what was listed, open a support case and include clear details so the admin team can review it quickly.",
  },
  {
    id: "cookie-preferences",
    title: "Cookie Preferences",
    body: "RHOVIC uses essential cookies for login, cart state, and secure sessions. Additional preference controls can be expanded later as the storefront grows.",
  },
];

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "closed") return "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-200";
  if (status === "in_progress") return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200";
}

export default function SupportPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<SupportThreadItem[]>([]);
  const [selectedID, setSelectedID] = useState<string>("");
  const [selected, setSelected] = useState<SupportThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [orderID, setOrderID] = useState("");
  const [openingMessage, setOpeningMessage] = useState("");
  const [reply, setReply] = useState("");

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedID) || selected?.thread || null,
    [threads, selectedID, selected]
  );

  async function loadThreads(preferredID?: string) {
    try {
      setLoading(true);
      setError("");
      const res = await api.get<{ items: SupportThreadItem[] }>("/support/threads?limit=100");
      setAuthRequired(false);
      const items = Array.isArray(res?.items) ? res.items : [];
      setThreads(items);
      const nextID = preferredID || selectedID || items[0]?.id || "";
      if (nextID) {
        setSelectedID(nextID);
        await loadThread(nextID);
      } else {
        setSelected(null);
      }
    } catch (err) {
      const message = (err as Error).message || "Failed to load support conversations.";
      if (message.includes("401")) {
        setAuthRequired(true);
        setThreads([]);
        setSelected(null);
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function loadThread(threadID: string) {
    try {
      const detail = await api.get<SupportThreadDetail>(`/support/threads/${threadID}`);
      setAuthRequired(false);
      setSelected(detail);
      setSelectedID(threadID);
    } catch (err) {
      const message = (err as Error).message || "Failed to load support conversation.";
      if (message.includes("401")) {
        setAuthRequired(true);
        return;
      }
      setError(message);
    }
  }

  useEffect(() => {
    void loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#cookie-preferences") return;
    const timer = window.setTimeout(() => {
      openCookiePreferences();
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedID || authRequired) return;
    const timer = window.setInterval(() => {
      void loadThread(selectedID);
    }, 12000);
    return () => window.clearInterval(timer);
  }, [selectedID, authRequired]);

  async function createThread() {
    if (authRequired) {
      router.push("/login?next=/support#live-chat");
      return;
    }
    if (!subject.trim() || !openingMessage.trim()) {
      setError("Please add a subject and message before sending.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const detail = await api.post<SupportThreadDetail>("/support/threads", {
        subject: subject.trim(),
        order_id: orderID.trim() || undefined,
        message: openingMessage.trim(),
      });
      setSubject("");
      setOrderID("");
      setOpeningMessage("");
      await loadThreads(detail.thread.id);
    } catch (err) {
      const message = (err as Error).message || "Failed to open support conversation.";
      if (message.includes("401")) {
        router.push("/login?next=/support#live-chat");
        return;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function sendReply() {
    if (authRequired) {
      router.push("/login?next=/support#live-chat");
      return;
    }
    if (!selectedID || !reply.trim()) return;
    try {
      setSaving(true);
      setError("");
      const detail = await api.post<SupportThreadDetail>(`/support/threads/${selectedID}/messages`, {
        message: reply.trim(),
      });
      setReply("");
      setSelected(detail);
      await loadThreads(selectedID);
    } catch (err) {
      const message = (err as Error).message || "Failed to send message.";
      if (message.includes("401")) {
        router.push("/login?next=/support#live-chat");
        return;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section id="help-center" className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-primary">Customer Care</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">How can we help you today?</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400">
              Use the help center below for quick guidance, then jump into live support chat when you need direct help from the RHOVIC team.
            </p>
          </div>
          <a href="#live-chat" className="btn-primary inline-flex items-center justify-center">
            Go to live chat
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {HELP_ITEMS.map((item) => (
          <article key={item.id} id={item.id} className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div className="text-lg font-black text-gray-900 dark:text-white">{item.title}</div>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">{item.body}</p>
            {item.id === "track-order" ? (
              <Link href="/my-orders" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
                Go to my orders
              </Link>
            ) : null}
            {item.id === "cookie-preferences" ? (
              <button
                type="button"
                onClick={openCookiePreferences}
                className="mt-4 inline-flex text-sm font-bold text-primary hover:underline"
              >
                Manage cookie preferences
              </button>
            ) : null}
          </article>
        ))}
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section id="live-chat" className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-primary">Live Chat</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">Talk to RHOVIC support</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Open a complaint, ask about payment, follow up on delivery, or request help with a marketplace issue. Your messages stay in one case thread until the matter is resolved.
            </p>
          </div>
          <Link href="/my-orders" className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
            View my orders
          </Link>
        </div>

        {authRequired ? (
          <div className="mt-6 rounded-[1.75rem] border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="text-lg font-black text-gray-900 dark:text-white">Sign in to start a support chat</div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              You can browse the help center without logging in, but you need an account before opening a case or continuing a support conversation.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/login?next=/support#live-chat" className="btn-primary inline-flex items-center justify-center">
                Login to continue
              </Link>
              <Link href="/signup" className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black/10">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Open a new case</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Start a support conversation and our admin team will respond here.</p>
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject e.g. Payment proof approved but order not updated"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  />
                  <input
                    value={orderID}
                    onChange={(e) => setOrderID(e.target.value)}
                    placeholder="Optional order ID"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  />
                  <textarea
                    value={openingMessage}
                    onChange={(e) => setOpeningMessage(e.target.value)}
                    placeholder="Tell us clearly what happened and what help you need."
                    rows={5}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  />
                  <button type="button" onClick={createThread} disabled={saving} className="btn-primary w-full disabled:opacity-60">
                    {saving ? "Sending..." : "Send to support"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-black/10">
                <div className="border-b border-black/10 px-5 py-4 dark:border-white/10">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">My conversations</h3>
                </div>

                {loading ? (
                  <div className="p-5 text-sm text-gray-600 dark:text-gray-400">Loading conversations...</div>
                ) : threads.length === 0 ? (
                  <div className="p-5 text-sm text-gray-600 dark:text-gray-400">No conversations yet. Start one above and it will appear here.</div>
                ) : (
                  <div className="divide-y divide-black/10 dark:divide-white/10">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => void loadThread(thread.id)}
                        className={`block w-full px-5 py-4 text-left transition ${thread.id === selectedID ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-extrabold text-gray-900 dark:text-white">{thread.subject}</div>
                            <div className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{thread.last_message || "No messages yet."}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${statusClass(thread.status)}`}>
                            {thread.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                          Updated {formatDate(thread.last_message_at)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-black/10">
              {!selectedThread ? (
                <div className="flex min-h-[540px] items-center justify-center p-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  Select a conversation to view messages, or open a new case.
                </div>
              ) : (
                <div className="flex min-h-[540px] flex-col">
                  <div className="border-b border-black/10 px-6 py-5 dark:border-white/10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.24em] text-primary">Support case</div>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">{selectedThread.subject}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className={`rounded-full px-2.5 py-1 font-black uppercase tracking-wide ${statusClass(selectedThread.status)}`}>
                            {selectedThread.status.replace("_", " ")}
                          </span>
                          {selectedThread.order_id ? <span>Order: {selectedThread.order_id}</span> : null}
                          <span>Opened {formatDate(selectedThread.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                    {selected?.messages?.map((message) => {
                      const isAdmin = message.sender_role === "admin";
                      return (
                        <div key={message.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${isAdmin ? "bg-black/5 text-gray-900 dark:bg-white/10 dark:text-white" : "bg-primary text-white"}`}>
                            <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">
                              {isAdmin ? "RHOVIC Support" : "You"}
                            </div>
                            <div className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.message}</div>
                            <div className={`mt-2 text-[11px] font-semibold ${isAdmin ? "text-gray-500 dark:text-gray-300" : "text-white/75"}`}>
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-black/10 px-6 py-5 dark:border-white/10">
                    {selectedThread.status === "closed" ? (
                      <div className="rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                        This conversation has been closed by support. If you still need help, please open a new case above.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={4}
                          placeholder="Reply to support..."
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-black/20 dark:text-white"
                        />
                        <div className="flex justify-end">
                          <button type="button" onClick={sendReply} disabled={saving || !reply.trim()} className="btn-primary min-w-[180px] disabled:opacity-60">
                            {saving ? "Sending..." : "Send reply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
