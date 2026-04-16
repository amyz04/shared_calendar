import { getToken } from "./auth";
import type { TripDateProposal } from "../types";

const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getProposalsApi(
  tripId: string,
): Promise<TripDateProposal[]> {
  const res = await fetch(`${BASE_URL}/trips/${tripId}/proposals`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch proposals");
  return res.json();
}

export async function proposeDateApi(
  tripId: string,
  startDate: string,
  endDate: string,
): Promise<TripDateProposal> {
  const res = await fetch(`${BASE_URL}/trips/${tripId}/proposals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ startDate, endDate }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to propose date");
  }
  return res.json();
}

export async function voteOnProposalApi(
  proposalId: string,
  vote: "AGREE" | "DISAGREE",
): Promise<TripDateProposal> {
  const res = await fetch(`${BASE_URL}/trips/proposals/${proposalId}/vote`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ vote }),
  });
  if (!res.ok) throw new Error("Failed to vote");
  return res.json();
}

export async function confirmProposalApi(
  proposalId: string,
): Promise<TripDateProposal> {
  const res = await fetch(`${BASE_URL}/trips/proposals/${proposalId}/confirm`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to confirm proposal");
  return res.json();
}
