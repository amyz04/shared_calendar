import { useMemo, useState, useEffect } from "react";
import type { Trip, Friend, BusyMap, CellData } from "../types";
import { daysInMonth, getFreeSlots, computeWindows } from "../utils";
import { getTripAvailabilityApi, type AvailabilityData } from "../api/calendar";

function toHour(iso: string): number {
  const timePart = iso.split("T")[1];
  if (!timePart) return 0;
  const [hours, minutes] = timePart.split(":").map(Number);
  return hours + minutes / 60;
}

function buildBusyMap(
  availability: AvailabilityData,
  year: number,
  month: number,
): { [day: number]: { s: number; e: number }[] } {
  const out: { [day: number]: { s: number; e: number }[] } = {};

  Object.entries(availability.events).forEach(([dateStr, blocks]) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (y !== year || m - 1 !== month) return;
    if (!blocks.length) return;
    out[d] = blocks.map((b) => ({
      s: toHour(b.start),
      e: toHour(b.end),
    }));
  });

  return out;
}

export function useAvailability(trip: Trip | null, members: Friend[]) {
  const [tripAvailability, setTripAvailability] = useState<
    Record<string, AvailabilityData>
  >({});
  const [loading, setLoading] = useState(false);

  const year = trip?.year ?? new Date().getFullYear();
  const month = trip?.month ?? new Date().getMonth();
  const days = daysInMonth(year, month);

  useEffect(() => {
    if (!trip) return;
    let cancelled = false;

    setLoading(true);
    getTripAvailabilityApi(trip.id)
      .then((data) => {
        if (!cancelled) setTripAvailability(data);
      })
      .catch((err) => console.error("Failed to fetch trip availability:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trip?.id]);

  const syncedMemberIds = useMemo(
    () =>
      new Set(
        members
          .filter((f) => tripAvailability[f.email] !== undefined)
          .map((f) => f.id),
      ),
    [tripAvailability, members],
  );

  const allBusy = useMemo<BusyMap>(() => {
    const out: BusyMap = {};
    members.forEach((f) => {
      const avail = tripAvailability[f.email];
      if (avail) {
        out[f.id] = buildBusyMap(avail, year, month);
      } else {
        out[f.id] = {};
      }
    });
    return out;
  }, [tripAvailability, trip?.id, members.length, year, month]);

  const cells = useMemo(() => {
    const out: { [d: number]: CellData } = {};
    for (let d = 1; d <= days; d++) {
      const mb = members.map((f) => ({
        f,
        blocks: allBusy[f.id]?.[d] || [],
      }));
      const syncedMembers = members.filter((f) => syncedMemberIds.has(f.id));
      const ab = mb
        .filter((x) => syncedMemberIds.has(x.f.id))
        .flatMap((x) => x.blocks);
      out[d] = {
        memberBusy: mb,
        freeSlots: syncedMembers.length > 0 ? getFreeSlots(ab) : [],
        fullyFree: syncedMembers.filter(
          (f) => (allBusy[f.id]?.[d] || []).length === 0,
        ),
      };
    }
    return out;
  }, [allBusy, days, members, syncedMemberIds]);

  const windows = useMemo(() => {
    const syncedMembers = members.filter((f) => syncedMemberIds.has(f.id));
    return computeWindows(syncedMembers, allBusy, year, month);
  }, [allBusy, trip?.id, syncedMemberIds]);

  const busyEventCounts = Object.fromEntries(
    members.map((f) => [
      f.id,
      Object.values(allBusy[f.id] || {}).reduce((s, b) => s + b.length, 0),
    ]),
  );

  return {
    allBusy,
    cells,
    windows,
    busyEventCounts,
    days,
    loading,
    syncedMemberIds,
  };
}
