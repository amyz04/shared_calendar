import { getToken } from "./auth";
import type { Trip, CreateTripData } from "../types";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getTripsApi(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/trip`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch current trips");
  return res.json();
}

export async function getTripApi(tripId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTripApi(data: CreateTripData): Promise<any> {
  const res = await fetch(`${BASE_URL}/trip`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create trip");
  }
  return res.json();
}

export async function deleteTripApi(tripId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete trip");
}

// friendId as query param to match @RequestParam in controller
export async function inviteMemberApi(
  tripId: string,
  friendId: string,
): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/trip/${tripId}/invite?friendId=${encodeURIComponent(friendId)}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to invite member");
  return res.json();
}

export async function joinTripApi(inviteToken: string): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/trip/join?inviteToken=${encodeURIComponent(inviteToken)}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to join trip");
  return res.json();
}

export async function leaveTripApi(tripId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}/leave`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to leave trip");
}

export async function respondToTripApi(
  tripId: string,
  status: "CONFIRMED" | "REJECTED",
): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/trip/${tripId}/respond?status=${status}`,
    {
      method: "PUT",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Failed to respond to trip");
  return res.json();
}
