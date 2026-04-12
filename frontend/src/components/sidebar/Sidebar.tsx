import { useNavigate, useLocation } from "react-router-dom";
import type { Trip } from "../../types";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";
import { SidebarTrips } from "./SidebarTrips";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelectTrip: (id: string) => void;
  onNewTrip: () => void;
  onOpenProfile: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  isGuest: boolean;
  onSignIn: () => void;
  onLogout: () => void;
}

export function Sidebar({
  trips,
  activeTripId,
  onSelectTrip,
  onNewTrip,
  onOpenProfile,
  isDark,
  toggleTheme,
  isGuest,
  onSignIn,
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen shrink-0">
      <SidebarBrand isDark={isDark} toggleTheme={toggleTheme} />
      <SidebarNav
        activePath={location.pathname}
        onNav={(path) => navigate(path)}
      />
      <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2.5 my-1" />
      <SidebarTrips
        trips={trips}
        activeTripId={activeTripId}
        onSelectTrip={onSelectTrip}
        onNewTrip={onNewTrip}
        isGuest={isGuest}
      />
      <SidebarFooter
        isGuest={isGuest}
        onOpenProfile={onOpenProfile}
        onSignIn={onSignIn}
        onLogout={onLogout}
      />
    </aside>
  );
}
