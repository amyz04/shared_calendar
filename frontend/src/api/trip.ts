import { getToken } from "./auth";
import type { Trip, CreateTripData } from "../types";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getTripsApi(): Promise<Trip[]> {
  const res = await fetch(`${BASE_URL}/trip`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch current trips");
  return res.json();
}

export async function getTripApi(tripId: string): Promise<Trip> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function createTripApi(data: CreateTripData): Promise<Trip> {
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

export async function inviteMemberApi(
  tripId: string,
  friendId: string,
): Promise<Trip> {
  const res = await fetch(`${BASE_URL}/trip/${tripId}/invite`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ friendId }),
  });
  if (!res.ok) throw new Error("Failed to invite member");
  return res.json();
}

export async function joinTripApi(inviteToken: string): Promise<Trip> {
  const res = await fetch(`${BASE_URL}/trip/join`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ inviteToken }),
  });
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
