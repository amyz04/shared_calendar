import type { Friend, Trip, NavId } from "./types";

export const FRIENDS: Friend[] = [
  {
    id: 1,
    name: "Alex Lee",
    initials: "AL",
    color: "#8b5cf6",
    email: "alex@email.com",
  },
];

export const CURRENT_USER: Friend = FRIENDS[0];

export const INIT_TRIPS: Trip[] = [
  {
    id: 1,
    name: "Portugal Summer",
    dest: "Lisbon",
    cover: "🇵🇹",
    year: 2025,
    month: 5,
    memberIds: [1, 2, 3, 4, 5],
    status: "planning",
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

export const EMOJIS = [
  "✈️",
  "🚃",
  "🏔️",
  "🗽",
  "🏖️",
  "🌸",
  "🎿",
  "🏝️",
  "🌍",
  "🍣",
  "🏕️",
  "🎭",
];

export const NAV_ITEMS: { id: NavId; label: string; icon: string }[] = [
  {
    id: "trips",
    label: "Trips",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "friends",
    label: "Friends",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
];
