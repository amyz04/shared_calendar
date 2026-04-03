export interface DateProposal {
  id: string;
  proposedBy: string;
  startDate: string;
  endDate: string;
  votes: { userId: string; vote: "agree" | "disagree" }[];
}

export interface EventItem {
  id: string;
  time: string;
  endTime: string;
  name: string;
  location: string;
  description: string;
  scope: "GROUP" | "PERSONAL";
  createdBy: string;
}

export interface ItineraryDay {
  date: string;
  events: EventItem[];
}

export interface ConfirmedRange {
  start: string;
  end: string;
}

export function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const endD = new Date(end);
  while (cur <= endD) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function fmtShortDate(dateStr: string): { day: number; weekday: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
  };
}