import type { Trip, NavId } from "./types";

export const INIT_TRIPS: Trip[] = [];

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

export const DAYS_SHORT = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

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

export const NAV_ITEMS = [
  {
    id: "trips",
    path: "/trips",
    label: "Trips",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
  {
    id: "calendar",
    path: "/calendar",
    label: "Calendar",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "friends",
    path: "/friends",
    label: "Friends",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
];
