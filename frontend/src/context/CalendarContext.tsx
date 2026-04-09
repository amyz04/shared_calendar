import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CalendarSource } from "../types";

interface CalendarContextType {
  calendars: CalendarSource[];
  calendarsSynced: boolean;
  showProfile: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  addCalendar: (c: CalendarSource) => void;
  removeCalendar: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        calendarsSynced: calendars.length > 0,
        showProfile,
        openProfile: () => setShowProfile(true),
        closeProfile: () => setShowProfile(false),
        addCalendar: (c) => setCalendars((prev) => [...prev, c]),
        removeCalendar: (id) =>
          setCalendars((prev) => prev.filter((c) => c.id !== id)),
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendars() {
  const ctx = useContext(CalendarContext);
  if (!ctx)
    throw new Error("useCalendars must be used within CalendarProvider");
  return ctx;
}
