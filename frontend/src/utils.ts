import type { Friend, TimeBlock, BusyMap } from "./types";

export const daysInMonth = (y: number, m: number) =>
  new Date(y, m + 1, 0).getDate();
export const firstDow = (y: number, m: number) => new Date(y, m, 1).getDay();
export const fmtH = (h: number) => (h >= 13 ? `${h - 12}pm` : `${h}am`);

export function genBusy(
  seed: number,
  year: number,
  month: number,
): { [d: number]: TimeBlock[] } {
  const days = daysInMonth(year, month);
  const busy: { [d: number]: TimeBlock[] } = {};
  let r = seed * 1234567;
  const rand = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  for (let d = 1; d <= days; d++) {
    busy[d] = [];
    const n = Math.floor(rand() * 3);
    const used: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const s = 8 + Math.floor(rand() * 9);
      const e = Math.min(s + 1 + Math.floor(rand() * 2.5), 18);
      if (!used.some(([us, ue]) => s < ue && e > us)) {
        used.push([s, e]);
        busy[d].push({ s, e });
      }
    }
  }
  return busy;
}

export function mergeTB(ivs: TimeBlock[]): TimeBlock[] {
  if (!ivs.length) return [];
  const s = [...ivs].sort((a, b) => a.s - b.s);
  const m = [{ ...s[0] }];
  for (let i = 1; i < s.length; i++) {
    const l = m[m.length - 1];
    if (s[i].s <= l.e) l.e = Math.max(l.e, s[i].e);
    else m.push({ ...s[i] });
  }
  return m;
}

export function getFreeSlots(all: TimeBlock[], s0 = 8, e0 = 18): TimeBlock[] {
  const m = mergeTB(all);
  const free: TimeBlock[] = [];
  let cur = s0;
  for (const { s, e } of m) {
    if (s > cur) free.push({ s: cur, e: s });
    cur = Math.max(cur, e);
  }
  if (cur < e0) free.push({ s: cur, e: e0 });
  return free.filter((f) => f.e - f.s >= 0.5);
}

export function computeWindows(
  members: Friend[],
  allBusy: BusyMap,
  year: number,
  month: number,
) {
  const days = daysInMonth(year, month);
  const results: any[] = [];
  for (let start = 1; start <= days - 1; start++) {
    for (let len = 2; len <= Math.min(8, days - start + 1); len++) {
      const end = start + len - 1;
      const freeNames: string[] = [],
        conflicts: string[] = [];
      members.forEach((f) => {
        let blocked = false;
        for (let d = start; d <= end; d++) {
          if ((allBusy[f.id]?.[d] || []).length >= 2) {
            blocked = true;
            break;
          }
        }
        if (!blocked) freeNames.push(f.name.split(" ")[0]);
        else conflicts.push(f.name.split(" ")[0]);
      });
      const count = freeNames.length;
      if (count >= Math.ceil(members.length * 0.6))
        results.push({
          start,
          end,
          len,
          count,
          total: members.length,
          freeNames,
          conflicts,
          score: Math.round((count / members.length) * 70 + (len / 7) * 30),
        });
    }
  }
  results.sort(
    (a, b) => b.score - a.score || b.count - a.count || b.len - a.len,
  );
  const seen = new Set<string>();
  return results
    .filter((w) => {
      const k = `${w.start}-${w.end}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 6);
}
