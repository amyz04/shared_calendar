import { useMemo, useState, useEffect } from "react";
import type { Trip, Friend, BusyMap, CellData } from "../types";
import { daysInMonth, getFreeSlots, computeWindows } from "../utils";
import { getAvailabilityApi, type AvailabilityData } from "../api/calendar";

function toHour(iso: string): number {
  // split on T and take the time part
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
    // parse date parts directly from the string — avoids timezone shifts
    const [y, m, d] = dateStr.split("-").map(Number);

    // month from API is 1-based
    // month in JS/React is 0-based
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
  const [availability, setAvailability] = useState<AvailabilityData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const year = trip?.year ?? new Date().getFullYear();
  const month = trip?.month ?? new Date().getMonth();
  const days = daysInMonth(year, month);

  useEffect(() => {
    if (!trip) return;
    let cancelled = false;

    setLoading(true);
    getAvailabilityApi()
      .then((data) => {
        if (!cancelled) {
          setAvailability(data);
          console.log(
            "Raw availability from API:",
            JSON.stringify(data, null, 2),
          );
        }
      })
      .catch((err) => console.error("Failed to fetch availability:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trip?.id]);

  const allBusy = useMemo<BusyMap>(() => {
    const out: BusyMap = {};

    members.forEach((f, i) => {
      if (i === 0 && availability) {
        // current user — use real calendar data only
        out[f.id] = buildBusyMap(availability, year, month);
      } else {
        // other members — empty until their calendars are connected
        out[f.id] = {};
      }
    });

    return out;
  }, [availability, trip?.id, members.length, year, month]);

  const cells = useMemo(() => {
    const out: { [d: number]: CellData } = {};
    for (let d = 1; d <= days; d++) {
      const mb = members.map((f) => ({
        f,
        blocks: allBusy[f.id]?.[d] || [],
      }));
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
  }, [allBusy, days, members]);

  const windows = useMemo(
    () => computeWindows(members, allBusy, year, month),
    [allBusy, trip?.id],
  );

  const busyEventCounts = Object.fromEntries(
    members.map((f) => [
      f.id,
      Object.values(allBusy[f.id] || {}).reduce((s, b) => s + b.length, 0),
    ]),
  );

  return { allBusy, cells, windows, busyEventCounts, days, loading };
}
