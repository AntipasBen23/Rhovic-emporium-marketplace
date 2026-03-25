"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

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
        router.replace("/login?next=/support");
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
      setSelected(detail);
      setSelectedID(threadID);
    } catch (err) {
      const message = (err as Error).message || "Failed to load support conversation.";
      if (message.includes("401")) {
        router.replace("/login?next=/support");
        return;
      }
      setError(message);
    }
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedID) return;
    const timer = window.setInterval(() => {
      void loadThread(selectedID);
    }, 12000);
    return () => window.clearInterval(timer);
  }, [selectedID]);

  async function createThread() {
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
      setError((err as Error).message || "Failed to open support conversation.");
    } finally {
      setSaving(false);
    }
  }

  async function sendReply() {
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
      setError((err as Error).message || "Failed to send message.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-primary">Customer Care</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white">Talk to RHOVIC support</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Send a complaint, delivery issue, payment concern, or product question. Your conversation stays in one thread and our admin team can reply directly until the issue is resolved.
            </p>
          </div>
          <Link href="/my-orders" className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
            View my orders
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Open a new case</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Start a support conversation and our admin team will respond here.</p>
              </div>
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

          <div className="rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="border-b border-black/10 px-5 py-4 dark:border-white/10">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">My conversations</h2>
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

        <section className="rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
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
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">{selectedThread.subject}</h2>
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
    </div>
  );
}
