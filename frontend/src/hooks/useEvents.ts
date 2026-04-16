import { useState, useEffect } from "react";
import {
  getEventsApi,
  createEventApi,
  deleteEventApi,
  type EventData,
  type CreateEventData,
} from "../api/events";

export function useEvents(itineraryId: string | null) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itineraryId) return;
    fetchEvents();
  }, [itineraryId]);

  async function fetchEvents() {
    if (!itineraryId) return;
    try {
      setLoading(true);
      const data = await getEventsApi(itineraryId);
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createEvent(data: CreateEventData) {
    if (!itineraryId) return;
    const newEvent = await createEventApi(itineraryId, data);
    setEvents((prev) => [...prev, newEvent]);
  }

  async function deleteEvent(eventId: string) {
    if (!itineraryId) return;
    await deleteEventApi(itineraryId, eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }

  return {
    events,
    loading,
    error,
    createEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
