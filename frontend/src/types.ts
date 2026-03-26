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
  id: number;
  name: string;
  dest: string;
  cover: string;
  year: number;
  month: number;
  memberIds: number[];
  status: "planning" | "confirmed";
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