import { useState, useEffect } from "react";
import type { CreateTripData } from "../../types";
import { MONTHS, EMOJIS } from "../../data";
import { getUser } from "../../api/auth";
import { getFriendships } from "../../api/friends";
import { createTripApi, inviteMemberApi } from "../../api/trip";
import { useTrips } from "../../context/TripContext";
import { inputCls } from "../ui/inputStyle";

interface FriendOption {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface NewTripModalProps {
  onClose: () => void;
  onCreate: (data: CreateTripData) => Promise<void>;
}

export function NewTripModal({ onClose, onCreate }: NewTripModalProps) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [cover, setCover] = useState("✈️");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string>("");
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const user = getUser();
  const { refetch } = useTrips();
  const ok = name.trim() !== "" && destination.trim() !== "";

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    try {
      const data = await getFriendships();
      const accepted: FriendOption[] = [];
      data.forEach((f: any) => {
        const isSender = f.sender.email === user?.email;
        const other = isSender ? f.invitee : f.sender;
        if (!other || f.status !== "ACCEPTED") return;
        accepted.push({
          id: other.id,
          name: `${other.firstName} ${other.lastName}`,
          email: other.email,
          avatarColor: other.avatarColor ?? "#8b5cf6",
        });
      });
      setFriends(accepted);
    } catch {
      // ignore
    }
  }

  function toggleFriend(id: string) {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function buildDates() {
    const pad = (n: number) => String(n).padStart(2, "0");
    const startDate = `${year}-${pad(month + 1)}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
    return { startDate, endDate };
  }

  async function handleSubmit() {
    if (!ok) return;
    try {
      setLoading(true);
      setError(null);
      const { startDate, endDate } = buildDates();

      // 1. Create the trip
      const newTrip = await createTripApi({
        name,
        destination,
        cover,
        startDate,
        endDate,
        details,
      });

      // 2. Invite selected friends
      for (const friendId of selectedFriends) {
        try {
          await inviteMemberApi(newTrip.id, friendId);
        } catch {
          // ignore individual invite failures
        }
      }

      // 3. Refetch trips so context is up to date
      await refetch();

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 w-[500px] max-h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 font-syne m-0">
            Plan a new trip
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-slate-500 text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Icon picker */}
        <div className="mb-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-2 font-medium">
            Trip icon
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setCover(e)}
                className={`w-9 h-9 rounded-lg text-[17px] cursor-pointer border transition-all ${
                  cover === e
                    ? "bg-violet-500/10 border-violet-500"
                    : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name + destination + details */}
        {(
          [
            ["Trip name", name, setName, "e.g. Portugal Summer"],
            ["Destination", destination, setDestination, "e.g. Lisbon"],
            ["Details", details, setDetails, "e.g. Escape room!"],
          ] as const
        ).map(([l, v, s, p]) => (
          <div key={l} className="mb-3.5">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              {l}
            </div>
            <input
              value={v as string}
              onChange={(e) => (s as (v: string) => void)(e.target.value)}
              placeholder={p as string}
              className={inputCls}
            />
          </div>
        ))}

        {/* Month + year */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              Month
            </div>
            <select
              value={month}
              onChange={(e) => setMonth(+e.target.value)}
              className={inputCls}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium font-syne">
              Year
            </div>
            <select
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className={inputCls}
            >
              {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invite friends */}
        <div className="mb-5">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium font-syne">
            Invite friends
          </div>
          {friends.length === 0 ? (
            <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-[12px] text-slate-400 dark:text-slate-500 font-syne">
              No friends yet — add friends from the Friends page first.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
              {friends.map((f) => {
                const selected = selectedFriends.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFriend(f.id)}
                    style={
                      selected
                        ? {
                            backgroundColor: `${f.avatarColor}10`,
                            borderColor: `${f.avatarColor}40`,
                          }
                        : undefined
                    }
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border transition-all ${
                      !selected
                        ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300"
                        : ""
                    }`}
                  >
                    <div
                      style={{
                        background: `${f.avatarColor}22`,
                        border: `1.5px solid ${f.avatarColor}55`,
                        color: f.avatarColor,
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-syne shrink-0"
                    >
                      {f.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={selected ? { color: f.avatarColor } : undefined}
                        className={`text-xs font-medium font-syne ${!selected ? "text-slate-900 dark:text-slate-100" : ""}`}
                      >
                        {f.name}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-600">
                        {f.email}
                      </div>
                    </div>
                    {selected && (
                      <div
                        style={{ backgroundColor: f.avatarColor }}
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      >
                        <svg
                          width={8}
                          height={8}
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Creator info */}
        {user && (
          <div className="mb-5 px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-syne mb-1">
              Created by
            </div>
            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-syne">
              {user.firstName} {user.lastName}
              <span className="text-[11px] text-slate-400 font-normal ml-1.5">
                (you)
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 mb-3 font-syne">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!ok || loading}
          className={`w-full py-2.5 rounded-lg text-[13px] font-semibold font-syne border-none transition-all ${
            ok && !loading
              ? "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default"
          }`}
        >
          {loading
            ? "Creating..."
            : `Create trip${selectedFriends.length > 0 ? ` & invite ${selectedFriends.length}` : ""}`}
        </button>
      </div>
    </div>
  );
}
