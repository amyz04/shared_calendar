import { getToken } from "./auth";
import type { CalendarSource } from "../types";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getCalendarsApi(): Promise<CalendarSource[]> {
  const res = await fetch(`${BASE_URL}/calendar`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch calendars");
  return res.json();
}

export async function importCalendarApi(
  file: File,
  name: string,
): Promise<CalendarSource> {
  const form = new FormData();
  form.append("file", file);
  form.append("name", name);
  const res = await fetch(`${BASE_URL}/calendar/import`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    // safely handle empty or non-JSON error responses
    const text = await res.text();
    let message = "Failed to import calendar";
    try {
      const json = JSON.parse(text);
      message = json.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }
  return res.json();
}

export async function deleteCalendarApi(calendarId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/calendar/${calendarId}`, {
    method: "DELETE",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete calendar");
}

export interface EventBlock {
  title: string;
  start: string;
  end: string;
}

export interface AvailabilityData {
  events: Record<string, EventBlock[]>;
}

export async function getAvailabilityApi(): Promise<AvailabilityData> {
  const res = await fetch(`${BASE_URL}/calendar/availability`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
}

export async function getTripAvailabilityApi(tripId: string): Promise<Record<string, AvailabilityData>> {
  const res = await fetch(`${BASE_URL}/calendar/availability/trip/${tripId}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch trip availability");
  return res.json();
}
