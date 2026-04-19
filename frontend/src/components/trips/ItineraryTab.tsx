import { useState, useEffect } from "react";
import type { Trip, Itinerary, TripEvent } from "../../types";
import {
  getItinerariesApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from "../../api/itineraries";
import { MONTHS } from "../../data";
import { inputCls } from "../ui/inputStyle";
import { getUser } from "../../api/auth";

interface ItineraryTabProps {
  trip: Trip;
  confirmedStartDate: string | null;
  confirmedEndDate: string | null;
}

interface EventFormData {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}

const EMPTY_FORM: EventFormData = {
  name: "",
  description: "",
  location: "",
  startTime: "",
  endTime: "",
};

export function ItineraryTab({
  trip,
  confirmedStartDate,
  confirmedEndDate,
}: ItineraryTabProps) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<"GROUP" | "PERSONAL">("GROUP");
  const [readOnlyEvent, setReadOnlyEvent] = useState<TripEvent | null>(null);
  const currentUser = getUser();

  function isEventOwner(event: TripEvent): boolean {
    return currentUser?.id === event.createdBy?.id;
  }

  function openReadOnly(event: TripEvent) {
    setReadOnlyEvent(event);
    setEditingEvent(null);
    setShowForm(false);
  }

  useEffect(() => {
    if (!confirmedStartDate) return;

    fetchItineraries();
    const interval = setInterval(fetchItineraries, 5000);
    return () => clearInterval(interval);
  }, [trip.id, confirmedStartDate]);

  async function fetchItineraries() {
    try {
      setItineraries((prev) => {
        if (prev.length === 0) setLoading(true);
        return prev;
      });
      const data = await getItinerariesApi(trip.id);
      // filter out personal events that don't belong to current user
      const filtered = data.map((itinerary) => ({
        ...itinerary,
        events: itinerary.events.filter(
          (e) => e.scope !== "PERSONAL" || e.createdBy?.id === currentUser?.id,
        ),
      }));
      setItineraries(filtered);
    } catch (err: any) {
      console.error("Failed to fetch itineraries:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const itinerary = itineraries.find((i) => i.dayNumber === activeDay);
    if (!itinerary) return;

    try {
      setSaving(true);
      setError(null);

      if (editingEvent) {
        // update existing event
        const updated = await updateEventApi(itinerary.id, editingEvent.id, {
          name: form.name,
          description: form.description,
          location: form.location,
          startTime: form.startTime
            ? `${itinerary.date}T${form.startTime}`
            : undefined,
          endTime: form.endTime
            ? `${itinerary.date}T${form.endTime}`
            : undefined,
          scope: scope,
        });
        setItineraries((prev) =>
          prev.map((i) =>
            i.id === itinerary.id
              ? {
                  ...i,
                  events: i.events.map((e) =>
                    e.id === updated.id ? updated : e,
                  ),
                }
              : i,
          ),
        );
      } else {
        // create new event
        const created = await createEventApi(itinerary.id, {
          name: form.name,
          description: form.description,
          location: form.location,
          startTime: form.startTime
            ? `${itinerary.date}T${form.startTime}`
            : undefined,
          endTime: form.endTime
            ? `${itinerary.date}T${form.endTime}`
            : undefined,
          scope: scope,
        });
        setItineraries((prev) =>
          prev.map((i) =>
            i.id === itinerary.id
              ? { ...i, events: [...i.events, created] }
              : i,
          ),
        );
      }

      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingEvent(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itineraryId: string, eventId: string) {
    try {
      await deleteEventApi(itineraryId, eventId);
      setItineraries((prev) =>
        prev.map((i) =>
          i.id === itineraryId
            ? { ...i, events: i.events.filter((e) => e.id !== eventId) }
            : i,
        ),
      );
      setEditingEvent(null);
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function openEdit(event: TripEvent) {
    if (!isEventOwner(event)) return;
    setEditingEvent(event);
    setForm({
      name: event.name,
      description: event.description ?? "",
      location: event.location ?? "",
      startTime: event.startTime
        ? event.startTime.split("T")[1]?.slice(0, 5)
        : "",
      endTime: event.endTime ? event.endTime.split("T")[1]?.slice(0, 5) : "",
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1].slice(0, 3)} ${d}`;
  }

  function formatTime(iso?: string) {
    if (!iso) return "";
    const t = iso.split("T")[1];
    if (!t) return "";
    const [h, min] = t.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    const h12 = h % 12 || 12;
    return `${h12}:${String(min).padStart(2, "0")}${ampm}`;
  }

  // not confirmed yet
  if (!confirmedStartDate) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 font-syne mb-2">
          Dates not confirmed yet
        </div>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Propose and confirm trip dates in the Availability tab before planning
          your itinerary.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-[13px] text-slate-400 font-syne">
        <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        Loading itinerary...
      </div>
    );
  }

  const activeItinerary = itineraries.find((i) => i.dayNumber === activeDay);

  return (
    <div>
      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5">
        {itineraries.map((it) => (
          <button
            key={it.id}
            onClick={() => {
              setActiveDay(it.dayNumber);
              setShowForm(false);
              setEditingEvent(null);
            }}
            className={`shrink-0 px-4 py-2 rounded-lg text-[12px] font-semibold font-syne border cursor-pointer transition-all ${
              activeDay === it.dayNumber
                ? "bg-violet-500/10 border-violet-500/50 text-violet-500"
                : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
            }`}
          >
            Day {it.dayNumber}
            <span className="block text-[10px] font-normal opacity-70">
              {formatDate(it.date)}
            </span>
          </button>
        ))}
      </div>

      {activeItinerary && (
        <div className="grid grid-cols-[1fr_320px] gap-5">
          {/* Events list */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
                  Day {activeItinerary.dayNumber} —{" "}
                  {formatDate(activeItinerary.date)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeItinerary.events.length} event
                  {activeItinerary.events.length !== 1 ? "s" : ""} planned
                </div>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-[12px] font-semibold font-syne border-none cursor-pointer transition-all"
              >
                <svg
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add event
              </button>
            </div>

            {activeItinerary.events.length === 0 ? (
              <div className="px-5 py-12 text-center flex flex-col items-center gap-2">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                  No events yet
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add activities, meals, or anything you want to do on this day.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {activeItinerary.events
                  .slice()
                  .sort((a, b) =>
                    (a.startTime ?? "").localeCompare(b.startTime ?? ""),
                  )
                  .map((event) => {
                    const canEdit = isEventOwner(event);
                    return (
                      <div
                        key={event.id}
                        onClick={() =>
                          canEdit ? openEdit(event) : openReadOnly(event)
                        }
                        className="px-5 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                              {event.name}
                            </div>
                            {!canEdit && (
                              <span className="text-[10px] text-slate-400 font-syne px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                                {event.createdBy?.firstName}'s event
                              </span>
                            )}
                          </div>
                          {(event.startTime || event.location) && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              {event.startTime && (
                                <span>
                                  {formatTime(event.startTime)}
                                  {event.endTime
                                    ? ` – ${formatTime(event.endTime)}`
                                    : ""}
                                </span>
                              )}
                              {event.location && (
                                <span>· {event.location}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={canEdit ? "#8b5cf6" : "#94a3b8"}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        >
                          {canEdit ? (
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          ) : (
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          )}
                        </svg>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Event form panel */}
          {showForm ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
                  {editingEvent ? "Edit event" : "New event"}
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                    setForm(EMPTY_FORM);
                  }}
                  className="bg-transparent border-none text-slate-400 cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                    Event name
                  </div>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Dinner at Alfama"
                    className={inputCls}
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                    Location
                  </div>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g. Alfama, Lisbon"
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                      Start time
                    </div>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, startTime: e.target.value }))
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                      End time
                    </div>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, endTime: e.target.value }))
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-syne">
                    Notes
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Any details..."
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* scope */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setScope("PERSONAL")}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold font-syne border cursor-pointer transition-all ${
                      scope === "PERSONAL"
                        ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-500"
                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-yellow-400/50 hover:text-yellow-400"
                    }`}
                  >
                    PERSONAL
                  </button>
                  <button
                    onClick={() => setScope("GROUP")}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold font-syne border cursor-pointer transition-all ${
                      scope === "GROUP"
                        ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-500"
                        : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-yellow-400/50 hover:text-yellow-400"
                    }`}
                  >
                    GROUP
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-syne">{error}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || saving}
                  className={`w-full py-2.5 rounded-lg text-[13px] font-semibold font-syne border-none transition-all ${
                    form.name.trim() && !saving
                      ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"
                  }`}
                >
                  {saving
                    ? "Saving..."
                    : editingEvent
                      ? "Save changes"
                      : "Add event"}
                </button>

                {editingEvent && (
                  <button
                    onClick={() =>
                      handleDelete(activeItinerary.id, editingEvent.id)
                    }
                    className="w-full py-2 rounded-lg text-[13px] font-semibold font-syne border border-red-400/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 cursor-pointer transition-all"
                  >
                    Delete event
                  </button>
                )}
              </div>
            </div>
          ) : readOnlyEvent ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-syne">
                  Event details
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-syne px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                    read only
                  </span>
                  <button
                    onClick={() => setReadOnlyEvent(null)}
                    className="bg-transparent border-none text-slate-400 cursor-pointer text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <div className="text-[11px] text-slate-400 font-syne mb-1">
                    Event
                  </div>
                  <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                    {readOnlyEvent.name}
                  </div>
                </div>
                {readOnlyEvent.location && (
                  <div>
                    <div className="text-[11px] text-slate-400 font-syne mb-1">
                      Location
                    </div>
                    <div className="text-[13px] text-slate-700 dark:text-slate-300 font-syne">
                      {readOnlyEvent.location}
                    </div>
                  </div>
                )}
                {(readOnlyEvent.startTime || readOnlyEvent.endTime) && (
                  <div>
                    <div className="text-[11px] text-slate-400 font-syne mb-1">
                      Time
                    </div>
                    <div className="text-[13px] text-slate-700 dark:text-slate-300 font-syne">
                      {formatTime(readOnlyEvent.startTime)}
                      {readOnlyEvent.endTime
                        ? ` – ${formatTime(readOnlyEvent.endTime)}`
                        : ""}
                    </div>
                  </div>
                )}
                {readOnlyEvent.description && (
                  <div>
                    <div className="text-[11px] text-slate-400 font-syne mb-1">
                      Notes
                    </div>
                    <div className="text-[13px] text-slate-700 dark:text-slate-300 font-syne leading-relaxed">
                      {readOnlyEvent.description}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-400 font-syne">
                    Added by {readOnlyEvent.createdBy?.firstName}{" "}
                    {readOnlyEvent.createdBy?.lastName}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col items-center justify-center gap-2 text-center">
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
                Click an event to edit
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Or add a new event for this day
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
