import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CalendarSource } from "../types";

interface CalendarContextType {
  calendars: CalendarSource[];
  calendarsSynced: boolean;
  addCalendar: (c: CalendarSource) => void;
  removeCalendar: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);

  const addCalendar = (c: CalendarSource) =>
    setCalendars((prev) => [...prev, c]);

  const removeCalendar = (id: string) =>
    setCalendars((prev) => prev.filter((c) => c.id !== id));

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        calendarsSynced: calendars.length > 0,
        addCalendar,
        removeCalendar,
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
