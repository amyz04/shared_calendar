import type { Trip, Friend } from "../types";
import { getUser } from "../api/auth";

export function useTripMembers(trip: Trip): Friend[] {
  const loggedInUser = getUser();

  // TODO: replace with real trip.members from backend
  // when friends API is connected this will map trip.members
  // to Friend objects using their real avatarColor and names
  if (trip.members && trip.members.length > 0) {
    return trip.members
      .filter((m) => m.status === "CONFIRMED")
      .map((m, i) => ({
        id: i + 1,
        name: `${m.firstName} ${m.lastName}`,
        initials: `${m.firstName?.[0] ?? ""}${m.lastName?.[0] ?? ""}`,
        color: m.avatarColor ?? "#8b5cf6",
        email: m.email,
        hasSynced: m.hasSynced,
      }));
  }

  // fallback to current user only if no members loaded yet
  return [
    {
      id: 1,
      name: loggedInUser
        ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
        : "You",
      initials: loggedInUser
        ? `${loggedInUser.firstName?.[0]}${loggedInUser.lastName?.[0]}`
        : "U",
      color: loggedInUser?.avatarColor ?? "#8b5cf6",
      email: loggedInUser?.email ?? "",
    },
  ];
}
