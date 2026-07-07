'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface DayEntry {
  pageType: string;
  label: string;
  count: number;
}

interface CalendarDay {
  date: string;
  entries: DayEntry[];
  total: number;
}

interface CalendarResponse {
  year: number;
  month: number;
  days: CalendarDay[];
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- signal loading before the fetch below resolves
    setLoading(true);
    apiFetch<CalendarResponse>(`/api/admin/analytics/calendar?year=${year}&month=${month}`, {
      withCredentials: true,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }, [year, month]);

  function changeMonth(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  const monthLabel = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const leadingBlanks = Array.from({ length: firstWeekday });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="rounded-md border border-neutral-300 px-3 py-1 text-sm">
          ‹ Prev
        </button>
        <h2 className="text-lg font-semibold text-neutral-900">{monthLabel}</h2>
        <button onClick={() => changeMonth(1)} className="rounded-md border border-neutral-300 px-3 py-1 text-sm">
          Next ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-500">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-2">
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {loading && <p className="col-span-7 py-8 text-center text-sm text-neutral-500">Loading visit data...</p>}
        {!loading &&
          data?.days.map((day) => (
            <div key={day.date} className="min-h-[90px] rounded-md border border-neutral-200 p-1.5 text-left">
              <p className="text-xs font-semibold text-neutral-700">{Number(day.date.slice(-2))}</p>
              {day.entries.length === 0 ? (
                <p className="mt-1 text-[11px] text-neutral-300">No visits</p>
              ) : (
                <ul className="mt-1 space-y-0.5">
                  {day.entries.map((entry) => (
                    <li key={entry.pageType} className="text-[11px] leading-tight text-brand">
                      {entry.count} {entry.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
