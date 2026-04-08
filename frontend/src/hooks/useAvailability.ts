import { useMemo } from "react";
import type { Trip, Friend, BusyMap, CellData } from "../types";
import { daysInMonth, genBusy, getFreeSlots, computeWindows } from "../utils";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function useAvailability(trip: Trip, members: Friend[]) {
  const { year, month } = trip;
  const days = daysInMonth(year, month);
  const tripSeed = hashString(trip.id);

  // TODO: replace genBusy with real API call to
  // GET /trip/{tripId}/availability when backend is ready
  const allBusy = useMemo<BusyMap>(() => {
    const out: BusyMap = {};
    members.forEach((f) => {
      out[f.id] = genBusy(f.id * 31 + tripSeed * 7, year, month);
    });
    return out;
  }, [trip.id, members.length]);

  const cells = useMemo(() => {
    const out: { [d: number]: CellData } = {};
    for (let d = 1; d <= days; d++) {
      const mb = members.map((f) => ({ f, blocks: allBusy[f.id]?.[d] || [] }));
      const ab = mb.flatMap((x) => x.blocks);
      out[d] = {
        memberBusy: mb,
        freeSlots: getFreeSlots(ab),
        fullyFree: members.filter(
          (f) => (allBusy[f.id]?.[d] || []).length === 0,
        ),
      };
    }
    return out;
  }, [trip.id, allBusy]);

  const windows = useMemo(
    () => computeWindows(members, allBusy, year, month),
    [trip.id, allBusy],
  );

  const busyEventCounts = Object.fromEntries(
    members.map((f) => [
      f.id,
      Object.values(allBusy[f.id] || {}).reduce((s, b) => s + b.length, 0),
    ]),
  );

  return { allBusy, cells, windows, busyEventCounts, days };
}
