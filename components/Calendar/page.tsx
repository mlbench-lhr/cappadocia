"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type CalendarGridProps = {
  onDataChange?: (data: {
    slots: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[];
    stopBookingDates: Date[];
  }) => void;
};

export default function CalendarGrid({ onDataChange }: CalendarGridProps) {
  const WINDOW_SIZE = 14;
  const [startOffset, setStartOffset] = useState(0);

  const generateDates = () => {
    const items: { label: string; date: Date }[] = [];
    const base = new Date();
    for (let i = 0; i < WINDOW_SIZE; i++) {
      const date = new Date(base);
      date.setDate(base.getDate() + startOffset + i);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      items.push({ label: `${day} ${month}`, date });
    }
    return items;
  };

  const dates = generateDates();
  const rows = [
    { id: "stop", name: "Stop Booking" },
    { id: "adult", name: "Adult Price (EUR)" },
    { id: "child", name: "Child Price (EUR)" },
    { id: "seats", name: "Seats Available" },
  ];

  const initial: Record<string, Record<string, any>> = {};
  rows.forEach((r) => {
    initial[r.id] = {} as Record<string, any>;
    dates.forEach((d) => {
      initial[r.id][d.label] = r.id === "stop" ? "false" : "0";
    });
  });

  const [values, setValues] = useState(initial);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const isDragging = useRef(false);
  const selectedRowRef = useRef<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    setValues((prev) => {
      const copy = { ...prev } as Record<string, Record<string, any>>;
      rows.forEach((r) => {
        copy[r.id] = { ...copy[r.id] };
        dates.forEach((d) => {
          if (!(d.label in copy[r.id])) {
            copy[r.id][d.label] = r.id === "stop" ? "false" : "0";
          }
        });
      });
      return copy;
    });
  }, [startOffset]);

  const keyFor = (rowId: string, dateLabel: string) => `${rowId}||${dateLabel}`;

  const handleMouseDown = (
    rowId: string,
    dateLabel: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const k = keyFor(rowId, dateLabel);
    isDragging.current = true;
    selectedRowRef.current = rowId;
    setSelectedKeys(new Set([k]));
  };

  const handleMouseEnter = (rowId: string, dateLabel: string) => {
    if (!isDragging.current) return;
    if (selectedRowRef.current && selectedRowRef.current !== rowId) return;
    const k = keyFor(rowId, dateLabel);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.add(k);
      return next;
    });
  };

  useEffect(() => {
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      // focus first selected input
      const first = selectedKeys.values().next();
      if (!first.done) {
        const ref = inputRefs.current[first.value as string];
        if (ref && typeof ref.focus === "function") ref.focus();
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [selectedKeys]);

  const updateSelected = (val: string) => {
    setValues((prev) => {
      const copy = { ...prev };
      selectedKeys.forEach((k) => {
        const [rowId, date] = k.split("||");
        if (rowId !== "stop") {
          copy[rowId] = { ...copy[rowId], [date]: val };
        }
      });
      return copy;
    });
    setDirty((prev) => {
      const next = new Set(prev);
      selectedKeys.forEach((k) => {
        const [rowId, date] = k.split("||");
        if (rowId === "stop") return;
        const def = "0";
        if (val !== def) next.add(k);
        else next.delete(k);
      });
      return next;
    });
  };

  const updateStopSelected = (value: string, currentKey: string) => {
    setValues((prev) => {
      const copy = { ...prev } as Record<string, Record<string, any>>;
      const [rowId, date] = currentKey.split("||");
      copy[rowId] = { ...copy[rowId], [date]: value };
      selectedKeys.forEach((k) => {
        const [r, d] = k.split("||");
        if (r === "stop") {
          copy[r] = { ...copy[r], [d]: value };
        }
      });
      return copy;
    });
    setDirty((prev) => {
      const next = new Set(prev);
      const def = "false";
      const [rowId, date] = currentKey.split("||");
      if (value !== def) next.add(`${rowId}||${date}`);
      else next.delete(`${rowId}||${date}`);
      selectedKeys.forEach((k) => {
        const [r, d] = k.split("||");
        if (r === "stop") {
          if (value !== def) next.add(k);
          else next.delete(k);
        }
      });
      return next;
    });
  };

  const midnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const isCompleteDay = (label: string) => {
    const ap = Number(values.adult[label]);
    const cp = Number(values.child[label]);
    const seats = Number(values.seats[label]);
    return ap > 0 && cp > 0 && seats > 0;
  };

  const emitData = () => {
    const slots: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    }[] = [];

    const stopBookingDates: Date[] = [];

    dates.forEach((d) => {
      const label = d.label;
      const flag = String(values.stop[label]) === "true";
      if (flag) stopBookingDates.push(midnight(d.date));
    });

    const isConsecutive = (a: Date, b: Date) => {
      const msPerDay = 24 * 60 * 60 * 1000;
      const aMid = new Date(
        a.getFullYear(),
        a.getMonth(),
        a.getDate()
      ).getTime();
      const bMid = new Date(
        b.getFullYear(),
        b.getMonth(),
        b.getDate()
      ).getTime();
      return bMid - aMid === msPerDay;
    };

    let current: {
      startDate: Date;
      endDate: Date;
      adultPrice: number;
      childPrice: number;
      seatsAvailable: number;
    } | null = null;

    const isModifiedDay = (label: string) => {
      return (
        dirty.has(`adult||${label}`) ||
        dirty.has(`child||${label}`) ||
        dirty.has(`seats||${label}`)
      );
    };

    for (let i = 0; i < dates.length; i++) {
      const d = dates[i];
      const label = d.label;
      if (!isCompleteDay(label)) continue;
      const ap = Number(values.adult[label]);
      const cp = Number(values.child[label]);
      const seats = Number(values.seats[label]);

      if (!current) {
        current = {
          startDate: midnight(d.date),
          endDate: midnight(d.date),
          adultPrice: ap,
          childPrice: cp,
          seatsAvailable: seats,
        };
        continue;
      }

      const same =
        current.adultPrice === ap &&
        current.childPrice === cp &&
        current.seatsAvailable === seats;
      const consecutive = isConsecutive(current.endDate, midnight(d.date));

      if (same && consecutive) {
        current.endDate = midnight(d.date);
      } else {
        slots.push(current);
        current = {
          startDate: midnight(d.date),
          endDate: midnight(d.date),
          adultPrice: ap,
          childPrice: cp,
          seatsAvailable: seats,
        };
      }
    }

    if (current) slots.push(current);
    if (onDataChange) onDataChange({ slots, stopBookingDates });
  };

  useEffect(() => {
    emitData();
  }, [values, dirty]);

  return (
    <div className="p-3 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setStartOffset((prev) => Math.max(0, prev - WINDOW_SIZE))
            }
            disabled={startOffset === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setStartOffset((prev) => prev + WINDOW_SIZE)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setValues((prev) => {
                const copy = { ...prev } as Record<string, Record<string, any>>;
                rows.forEach((r) => {
                  dates.forEach((d) => {
                    copy[r.id][d.label] =
                      r.id === "stop"
                        ? "false"
                        : r.id === "seats"
                        ? "10"
                        : "300";
                  });
                });
                return copy;
              });
              setDirty((prev) => {
                const next = new Set(prev);
                dates.forEach((d) => {
                  ["adult", "child", "seats", "stop"].forEach((rid) => {
                    next.delete(`${rid}||${d.label}`);
                  });
                });
                return next;
              });
            }}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {dates[0].label} – {dates[dates.length - 1].label}
        </div>
      </div>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left bg-gray-200">
              Hot Air Balloon Sunrise
            </th>
            {dates.map((d) => (
              <th
                key={d.label}
                className="border border-gray-300 p-2 bg-gray-200"
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border border-gray-300 p-2 bg-gray-50">
                {row.name}
              </td>
              {dates.map((date) => {
                const k = keyFor(row.id, date.label);
                const isSelected = selectedKeys.has(k);
                const isDirtyCell = dirty.has(k);
                return (
                  <td
                    key={date.label}
                    onMouseDown={(e) => handleMouseDown(row.id, date.label, e)}
                    onMouseEnter={() => handleMouseEnter(row.id, date.label)}
                    className={`border border-gray-300 p-0 w-24 ${
                      isSelected
                        ? "bg-blue-100"
                        : isDirtyCell
                        ? "bg-emerald-50"
                        : "bg-white"
                    }`}
                  >
                    {row.id === "stop" ? (
                      <div className="flex items-center justify-center p-2">
                        <input
                          type="checkbox"
                          checked={
                            String(values[row.id][date.label]) === "true"
                          }
                          onChange={(e) => {
                            const cellKey = keyFor(row.id, date.label);
                            selectedRowRef.current = "stop";
                            updateStopSelected(
                              e.target.checked ? "true" : "false",
                              cellKey
                            );
                          }}
                          onFocus={() => {
                            selectedRowRef.current = row.id;
                            setSelectedKeys((prev) => {
                              const next = new Set(prev);
                              next.add(k);
                              return next;
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        ref={(el) => {
                          inputRefs.current[k] = el as HTMLInputElement | null;
                        }}
                        value={values[row.id][date.label]}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const num = Math.max(0, Number(raw) || 0);
                          const newVal = String(num);
                          if (selectedKeys.has(k)) {
                            updateSelected(newVal);
                          } else {
                            setValues((prev) => ({
                              ...prev,
                              [row.id]: {
                                ...prev[row.id],
                                [date.label]: newVal,
                              },
                            }));
                            setDirty((prev) => {
                              const next = new Set(prev);
                              const def = "0";
                              if (newVal !== def) next.add(k);
                              else next.delete(k);
                              return next;
                            });
                          }
                        }}
                        onFocus={() => {
                          selectedRowRef.current = row.id;
                          setSelectedKeys((prev) => {
                            const next = new Set(prev);
                            next.add(k);
                            return next;
                          });
                        }}
                        className="w-full p-2 border-none outline-none bg-transparent text-center"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4" />
    </div>
  );
}
