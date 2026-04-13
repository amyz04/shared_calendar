import { getToken } from "./auth";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export interface EventData {
  id: string;
  itineraryId: string;
  name: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  scope: "GROUP" | "PERSONAL";
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateEventData {
  name: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  scope: "GROUP" | "PERSONAL";
}

export async function getEventsApi(itineraryId: string): Promise<EventData[]> {
  const res = await fetch(`${BASE_URL}/itinerary/${itineraryId}/events`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function createEventApi(
  itineraryId: string,
  data: CreateEventData,
): Promise<EventData> {
  const res = await fetch(`${BASE_URL}/itinerary/${itineraryId}/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create event");
  }
  return res.json();
}

export async function updateEventApi(
  itineraryId: string,
  eventId: string,
  data: Partial<CreateEventData>,
): Promise<EventData> {
  const res = await fetch(
    `${BASE_URL}/itinerary/${itineraryId}/events/${eventId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEventApi(
  itineraryId: string,
  eventId: string,
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/itinerary/${itineraryId}/events/${eventId}`,
    { method: "DELETE", headers: authHeaders() },
  );
  if (!res.ok) throw new Error("Failed to delete event");
}
