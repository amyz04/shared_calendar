export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarColor: string;
  dateOfBirth?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TripMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarColor: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  joinedAt: string;
}

export interface Friend {
  id: number;
  name: string;
  initials: string;
  color: string;
  email: string;
}

export interface TimeBlock {
  s: number;
  e: number;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  cover: string;
  inviteToken: string;
  owner: User;
  members: TripMember[];
  itineraryId: string | null;
  startDate: string;
  endDate: string;
  status: "PROPOSED" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  // frontend-only fields for calendar display
  year: number;
  month: number;
  dest: string;
  memberIds: number[];
}

export interface CreateTripData {
  name: string;
  destination: string;
  cover: string;
  startDate: string;
  endDate: string;
  details?: string;
}

export interface BusyMap {
  [uid: number]: { [day: number]: TimeBlock[] };
}

export interface CellData {
  memberBusy: { f: Friend; blocks: TimeBlock[] }[];
  freeSlots: TimeBlock[];
  fullyFree: Friend[];
}

export interface CalendarSource {
  id: string;
  name: string;
  source: "google" | "apple" | "ics";
  eventCount: number;
  color: string;
}

export type NavId = "trips" | "calendar" | "friends";

export type AuthMode = "user" | "guest" | null;

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}
