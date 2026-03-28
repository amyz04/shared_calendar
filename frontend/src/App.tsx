import { useState, useEffect } from "react";
import { INIT_TRIPS } from "./data";
import type { NavId, Trip, CalendarSource, AuthMode } from "./types";
import { Sidebar } from "./components/sidebar/Sidebar";
import { LoginPage } from "./components/login/LoginPage";
import { CalendarPage } from "./components/calendar/CalendarPage";
import { TripsPage } from "./components/trips/TripsPage";
import { FriendsPage } from "./components/friends/FriendsPage";
import { ProfilePanel } from "./components/profile/ProfilePanel";
import { NewTripModal } from "./components/trips/NewTripModal";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [view, setView] = useState<NavId>("trips");
  const [trips, setTrips] = useState<Trip[]>(INIT_TRIPS);
  const [activeTripId, setActive] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);

  // Apply dark class to <html> for Tailwind dark mode strategy
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);
  const calendarsSynced = calendars.length > 0;
  const isGuest = authMode === "guest";

  const handleCreate = (data: Omit<Trip, "id" | "status">) => {
    const id = Math.max(...trips.map((t) => t.id)) + 1;
    setTrips((p) => [...p, { id, status: "planning", ...data }]);
    setActive(id);
    setView("calendar");
  };

  if (!authMode) {
    return (
      <LoginPage
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAuth={setAuthMode}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {showModal && !isGuest && (
        <NewTripModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
      {showProfile && !isGuest && (
        <ProfilePanel
          onClose={() => setShowProfile(false)}
          calendars={calendars}
          onAddCalendar={(c) => setCalendars((p) => [...p, c])}
          onRemoveCalendar={(id) =>
            setCalendars((p) => p.filter((c) => c.id !== id))
          }
        />
      )}

      <Sidebar
        active={view}
        onNav={setView}
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={setActive}
        onNewTrip={() => !isGuest && setShowModal(true)}
        onOpenProfile={() => !isGuest && setShowProfile(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isGuest={isGuest}
        onSignIn={() => setAuthMode(null)}
      />

      <main className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-900">
        <div className="flex justify-end mb-8 gap-2.5">
          {isGuest && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-[11px] text-amber-400 font-syne">
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
              Guest mode
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-syne">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Spring Boot · connected
          </div>
        </div>

        {view === "trips" && (
          <TripsPage
            trips={trips}
            onSelectTrip={setActive}
            onNewTrip={() => setShowModal(true)}
            onNav={setView}
            isGuest={isGuest}
          />
        )}
        {view === "calendar" && (
          <CalendarPage
            trips={trips}
            activeTripId={activeTripId}
            onSelectTrip={setActive}
            onOpenProfile={() =>
              isGuest ? setAuthMode(null) : setShowProfile(true)
            }
            calendarsSynced={calendarsSynced}
            isGuest={isGuest}
          />
        )}
        {view === "friends" && <FriendsPage trips={trips} isGuest={isGuest} />}
      </main>
    </div>
  );
}
