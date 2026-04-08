import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useTrips } from "./context/TripContext";
import { useCalendars } from "./context/CalendarContext";
import { useModal } from "./hooks/useModal";
import { Sidebar } from "./components/sidebar/Sidebar";
import { LoginPage } from "./components/login/LoginPage";
import { TripsPage } from "./components/trips/TripsPage";
import { TripDetailPage } from "./components/trips/TripDetailPage";
import { FriendsPage } from "./components/friends/FriendsPage";
import { ProfilePanel } from "./components/profile/ProfilePanel";
import { NewTripModal } from "./components/trips/NewTripModal";
import { StatusBar } from "./components/ui/StatusBar";
import type { CreateTripData } from "./types";
import { useNavigate } from "react-router-dom";

export default function App() {
  const { isAuthenticated, authMode, setAuthMode } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { trips, loading, activeTripId, setActiveTripId, createTrip } =
    useTrips();
  const { calendars, calendarsSynced, addCalendar, removeCalendar } =
    useCalendars();
  const tripModal = useModal();
  const profileModal = useModal();
  const navigate = useNavigate();

  const isGuest = authMode === "guest";

  async function handleCreate(data: CreateTripData) {
    const newTrip = await createTrip(data);
    tripModal.close();
    navigate("/calendar");
  }

  if (!isAuthenticated && authMode !== "guest") {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              isDark={isDark}
              toggleTheme={toggleTheme}
              onAuth={(mode) => {
                setAuthMode(mode);
                navigate("/trips");
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {tripModal.isOpen && !isGuest && (
        <NewTripModal onClose={tripModal.close} onCreate={handleCreate} />
      )}
      {profileModal.isOpen && !isGuest && (
        <ProfilePanel
          onClose={profileModal.close}
          calendars={calendars}
          onAddCalendar={addCalendar}
          onRemoveCalendar={removeCalendar}
        />
      )}

      <Sidebar
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={setActiveTripId}
        onNewTrip={() => !isGuest && tripModal.open()}
        onOpenProfile={() => !isGuest && profileModal.open()}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isGuest={isGuest}
        onSignIn={() => {
          setAuthMode(null);
          navigate("/login");
        }}
      />

      <main className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-900">
        <StatusBar isGuest={isGuest} loading={loading} />

        <Routes>
          <Route
            path="/trips"
            element={
              <TripsPage
                trips={trips}
                onSelectTrip={setActiveTripId}
                onNewTrip={tripModal.open}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <TripDetailPage
                trips={trips}
                activeTripId={activeTripId}
                onSelectTrip={setActiveTripId}
                onOpenProfile={() =>
                  isGuest ? setAuthMode(null) : profileModal.open()
                }
                calendarsSynced={calendarsSynced}
                isGuest={isGuest}
              />
            }
          />
          <Route
            path="/friends"
            element={<FriendsPage trips={trips} isGuest={isGuest} />}
          />
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="*" element={<Navigate to="/trips" replace />} />
        </Routes>
      </main>
    </div>
  );
}
