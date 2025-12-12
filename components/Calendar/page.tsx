"use client";
import { useState, useRef, useEffect } from "react";

export default function CalendarGrid() {
  // Generate next 14 days from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      dates.push(`${day} ${month}`);
    }
    return dates;
  };

  const dates = generateDates();
  const rows = [
    { id: "stop", name: "Stop Booking" },
    { id: "adult", name: "Adult Price (EUR)" },
    { id: "child", name: "Child Price (EUR)" },
    { id: "seats", name: "Seats Available" },
  ];

  // initialize as strings so user can type freely
  const initial = {};
  rows.forEach((r) => {
    initial[r.id] = {};
    dates.forEach((d) => (initial[r.id][d] = r.id === "seats" ? "10" : "300"));
  });

  const [values, setValues] = useState(initial);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const isDragging = useRef(false);
  const inputRefs = useRef({});

  const keyFor = (rowId, date) => `${rowId}||${date}`;

  const handleMouseDown = (rowId, date, e) => {
    e.preventDefault();
    const k = keyFor(rowId, date);
    isDragging.current = true;
    setSelectedKeys(new Set([k]));
  };

  const handleMouseEnter = (rowId, date) => {
    if (!isDragging.current) return;
    const k = keyFor(rowId, date);
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
        const ref = inputRefs.current[first.value];
        if (ref && typeof ref.focus === "function") ref.focus();
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [selectedKeys]);

  // update all selected cells to a value (string)
  const updateSelected = (val) => {
    setValues((prev) => {
      const copy = { ...prev };
      selectedKeys.forEach((k) => {
        const [rowId, date] = k.split("||");
        copy[rowId] = { ...copy[rowId], [date]: val };
      });
      return copy;
    });
  };

  return (
    <div className="p-3 select-none">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left bg-gray-200">
              Hot Air Balloon Sunrise
            </th>
            {dates.map((d) => (
              <th key={d} className="border border-gray-300 p-2 bg-gray-200">
                {d}
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
                const k = keyFor(row.id, date);
                const isSelected = selectedKeys.has(k);
                return (
                  <td
                    key={date}
                    onMouseDown={(e) => handleMouseDown(row.id, date, e)}
                    onMouseEnter={() => handleMouseEnter(row.id, date)}
                    className={`border border-gray-300 p-0 w-20 ${
                      isSelected ? "bg-blue-100" : "bg-white"
                    }`}
                  >
                    <input
                      ref={(el) => (inputRefs.current[k] = el)}
                      value={values[row.id][date]}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        // if this cell is selected, apply to all selected
                        if (selectedKeys.has(k)) {
                          updateSelected(newVal);
                        } else {
                          setValues((prev) => ({
                            ...prev,
                            [row.id]: { ...prev[row.id], [date]: newVal },
                          }));
                        }
                      }}
                      onFocus={() => {
                        // if user focuses manually, make it part of selection
                        setSelectedKeys((prev) => {
                          const next = new Set(prev);
                          next.add(k);
                          return next;
                        });
                      }}
                      className="w-full p-2 border-none outline-none bg-transparent text-center"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
