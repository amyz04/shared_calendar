import { getToken } from "./auth";
import type { Itinerary, TripEvent } from "../types";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getItinerariesApi(tripId: string): Promise<Itinerary[]> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}/itineraries`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch itineraries");
  return res.json();
}

export async function createEventApi(
  itineraryId: string,
  data: Partial<TripEvent>,
): Promise<TripEvent> {
  const res = await fetch(`${BASE_URL}/itinerary/${itineraryId}/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function updateEventApi(
  itineraryId: string,
  eventId: string,
  data: Partial<TripEvent>,
): Promise<TripEvent> {
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
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to delete event");
}
