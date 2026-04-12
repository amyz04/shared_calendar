import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CalendarSource } from "../types";
import { getCalendarsApi, deleteCalendarApi } from "../api/calendar";
import { useAuth } from "./AuthContext";

interface CalendarContextType {
  calendars: CalendarSource[];
  calendarsSynced: boolean;
  showProfile: boolean;
  loading: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  addCalendar: (c: CalendarSource) => void;
  removeCalendar: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch calendars from backend when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCalendars();
    } else {
      setCalendars([]);
    }
  }, [isAuthenticated]);

  async function fetchCalendars() {
    try {
      setLoading(true);
      const data = await getCalendarsApi();
      setCalendars(data);
    } catch (err: any) {
      console.error("Failed to fetch calendars:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeCalendar(id: string) {
    try {
      await deleteCalendarApi(id);
      setCalendars((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("Failed to delete calendar:", err.message);
    }
  }

  function addCalendar(c: CalendarSource) {
    setCalendars((prev) => [...prev, c]);
  }

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        calendarsSynced: calendars.length > 0,
        showProfile,
        loading,
        openProfile: () => setShowProfile(true),
        closeProfile: () => setShowProfile(false),
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
