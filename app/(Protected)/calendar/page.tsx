"use client";
import { useState, useRef, useEffect } from "react";

export default function CalendarGrid() {
  const dates = [
    "12 Nov",
    "13 Nov",
    "14 Nov",
    "15 Nov",
    "16 Nov",
    "17 Nov",
    "18 Nov",
  ];
  const rooms = [
    { id: "106", name: "Deluxe Arch Suite" },
    { id: "101", name: "Deluxe Cave Suite" },
  ];

  // initialize as strings so user can type freely
  const initial = {};
  rooms.forEach((r) => {
    initial[r.id] = {};
    dates.forEach((d) => (initial[r.id][d] = "300"));
  });

  const [values, setValues] = useState(initial);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const isDragging = useRef(false);
  const inputRefs = useRef({});

  const keyFor = (roomId, date) => `${roomId}||${date}`;

  const handleMouseDown = (roomId, date, e) => {
    e.preventDefault();
    const k = keyFor(roomId, date);
    isDragging.current = true;
    setSelectedKeys(new Set([k]));
  };

  const handleMouseEnter = (roomId, date) => {
    if (!isDragging.current) return;
    const k = keyFor(roomId, date);
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
        const [roomId, date] = k.split("||");
        copy[roomId] = { ...copy[roomId], [date]: val };
      });
      return copy;
    });
  };

  return (
    <div style={{ padding: 12, userSelect: "none" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: 8,
                textAlign: "left",
              }}
            >
              Room
            </th>
            {dates.map((d) => (
              <th key={d} style={{ border: "1px solid #ddd", padding: 8 }}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {room.name}
              </td>
              {dates.map((date) => {
                const k = keyFor(room.id, date);
                const isSelected = selectedKeys.has(k);
                return (
                  <td
                    key={date}
                    onMouseDown={(e) => handleMouseDown(room.id, date, e)}
                    onMouseEnter={() => handleMouseEnter(room.id, date)}
                    style={{
                      border: "1px solid #ddd",
                      padding: 0,
                      background: isSelected ? "#cfe8ff" : "white",
                      width: 80,
                    }}
                  >
                    <input
                      ref={(el) => (inputRefs.current[k] = el)}
                      value={values[room.id][date]}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        // if this cell is selected, apply to all selected
                        if (selectedKeys.has(k)) {
                          updateSelected(newVal);
                        } else {
                          setValues((prev) => ({
                            ...prev,
                            [room.id]: { ...prev[room.id], [date]: newVal },
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
                      style={{
                        width: "100%",
                        padding: 8,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
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
