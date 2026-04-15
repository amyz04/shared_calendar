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
  status: string;
  joinedAt: string;
  hasSynced: boolean;
}

export interface Friend {
  id: number;
  name: string;
  initials: string;
  color: string;
  email: string;
  hasSynced?: boolean;
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
  isOwner: boolean;
  acceptedCount: number;
  declinedCount: number;
  currentUserStatus: string;
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
  createdAt: string;
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

export interface VoteResponse {
  id: string;
  user: User;
  vote: "AGREE" | "DISAGREE";
}

export interface TripDateProposal {
  id: string;
  tripId: string;
  proposedBy: User;
  startDate: string;
  endDate: string;
  status: "PROPOSED" | "CONFIRMED" | "REJECTED";
  votes: VoteResponse[];
  agreeCount: number;
  disagreeCount: number;
  createdAt: string;
}

export interface Itinerary {
  id: string;
  tripId: string;
  notes: string;
  dayNumber: number;
  date: string;
  events: TripEvent[];
  createdAt: string;
}

export interface TripEvent {
  id: string;
  itineraryId: string;
  name: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  scope: "PERSONAL" | "GROUP";
  status: "PROPOSED" | "CONFIRMED" | "CANCELLED";
  createdBy: string;
  createdAt: string;
}
