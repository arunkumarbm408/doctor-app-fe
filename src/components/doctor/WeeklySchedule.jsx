import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveAvailability, clearAvailStatus } from "../../features/doctors/doctorsSlice";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function initSchedule(existingSlots = []) {
  const sched = {};
  DAYS.forEach((d) => { sched[d] = { enabled: false, slots: [] }; });
  existingSlots.forEach((s) => {
    if (!sched[s.day]) return;
    sched[s.day].enabled = true;
    sched[s.day].slots.push({
      id: Math.random().toString(36).slice(2),
      startTime: s.startTime || "09:00",
      endTime: s.endTime || "10:00",
      maxPatients: s.maxPatients || 1,
    });
  });
  return sched;
}

function toSlotArray(schedule) {
  const result = [];
  DAYS.forEach((day) => {
    if (schedule[day].enabled) {
      schedule[day].slots.forEach((s) => {
        result.push({ day, startTime: s.startTime, endTime: s.endTime, maxPatients: Number(s.maxPatients) || 1 });
      });
    }
  });
  return result;
}

const WeeklySchedule = ({ existingSlots = [], onSaved }) => {
  const dispatch = useDispatch();
  const { availLoading, availError, availSuccess } = useSelector((s) => s.doctors);
  const [schedule, setSchedule] = useState(() => initSchedule(existingSlots));

  useEffect(() => {
    setSchedule(initSchedule(existingSlots));
  }, [existingSlots]);

  useEffect(() => {
    if (availSuccess) {
      const t = setTimeout(() => dispatch(clearAvailStatus()), 3000);
      if (onSaved) onSaved();
      return () => clearTimeout(t);
    }
  }, [availSuccess, dispatch, onSaved]);

  const toggleDay = (day) => {
    setSchedule((prev) => {
      const cur = prev[day];
      const slots =
        !cur.enabled && cur.slots.length === 0
          ? [{ id: Math.random().toString(36).slice(2), startTime: "09:00", endTime: "10:00", maxPatients: 1 }]
          : cur.slots;
      return { ...prev, [day]: { enabled: !cur.enabled, slots } };
    });
  };

  const addSlot = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { id: Math.random().toString(36).slice(2), startTime: "09:00", endTime: "10:00", maxPatients: 1 },
        ],
      },
    }));
  };

  const removeSlot = (day, id) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], slots: prev[day].slots.filter((s) => s.id !== id) },
    }));
  };

  const updateSlot = (day, id, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      },
    }));
  };

  const handleSave = () => dispatch(saveAvailability(toSlotArray(schedule)));

  return (
    <div>
      {availError && (
        <div
          className="d-flex align-items-center gap-2 py-2 px-3 mb-3"
          style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--r-md)", fontSize: "0.85rem", color: "#dc2626" }}
        >
          <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
          {availError}
        </div>
      )}
      {availSuccess && (
        <div
          className="d-flex align-items-center gap-2 py-2 px-3 mb-3"
          style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "var(--r-md)", fontSize: "0.85rem", color: "#16a34a" }}
        >
          <i className="bi bi-check-circle-fill flex-shrink-0" />
          Availability saved successfully!
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        {DAYS.map((day) => {
          const { enabled, slots } = schedule[day];
          return (
            <div
              key={day}
              style={{
                border: `1.5px solid ${enabled ? "var(--teal-border)" : "var(--border)"}`,
                borderRadius: "var(--r-lg)",
                background: enabled ? "var(--teal-soft)" : "var(--bg-2)",
                overflow: "hidden",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              {/* Day header */}
              <div
                className="d-flex align-items-center justify-content-between px-3"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderBottom: enabled && slots.length > 0 ? "1px solid var(--teal-border)" : "none",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    onClick={() => toggleDay(day)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 4,
                      background: enabled ? "var(--teal)" : "var(--border)",
                      position: "relative",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 2,
                        left: enabled ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: enabled ? "var(--teal-dark)" : "var(--text-3)",
                    }}
                  >
                    {day}
                  </span>
                  {!enabled && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-4)",
                        background: "var(--border)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      Off
                    </span>
                  )}
                </div>
                {enabled && (
                  <button
                    type="button"
                    onClick={() => addSlot(day)}
                    style={{
                      background: "none",
                      border: "1px dashed var(--teal-border)",
                      borderRadius: 6,
                      padding: "3px 10px",
                      color: "var(--teal-dark)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-plus" /> Add Slot
                  </button>
                )}
              </div>

              {/* Slots */}
              {enabled && slots.length > 0 && (
                <div className="px-3 py-2 d-flex flex-column gap-2">
                  {slots.map((slot) => (
                    <div key={slot.id} className="d-flex align-items-center gap-2 flex-wrap" style={{ padding: "4px 0" }}>
                      <div className="d-flex align-items-center gap-1 flex-grow-1">
                        <i className="bi bi-clock" style={{ color: "var(--teal)", fontSize: "0.8rem" }} />
                        <input
                          type="time"
                          className="form-control form-control-soft form-control-sm"
                          style={{ width: 112, fontSize: "0.82rem" }}
                          value={slot.startTime}
                          onChange={(e) => updateSlot(day, slot.id, "startTime", e.target.value)}
                        />
                        <span style={{ color: "var(--text-3)", fontSize: "0.78rem" }}>–</span>
                        <input
                          type="time"
                          className="form-control form-control-soft form-control-sm"
                          style={{ width: 112, fontSize: "0.82rem" }}
                          value={slot.endTime}
                          onChange={(e) => updateSlot(day, slot.id, "endTime", e.target.value)}
                        />
                      </div>
                      <div className="d-flex align-items-center gap-1 ms-auto">
                        <i className="bi bi-people-fill" style={{ color: "var(--teal)", fontSize: "0.8rem" }} />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          className="form-control form-control-soft form-control-sm text-center"
                          style={{ width: 58, fontSize: "0.82rem" }}
                          value={slot.maxPatients}
                          onChange={(e) => updateSlot(day, slot.id, "maxPatients", e.target.value)}
                        />
                        <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>pts</span>
                        <button
                          type="button"
                          onClick={() => removeSlot(day, slot.id)}
                          title="Remove slot"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            padding: "2px 5px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            lineHeight: 1,
                          }}
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {enabled && slots.length === 0 && (
                <div className="px-3 py-2 text-center" style={{ color: "var(--text-4)", fontSize: "0.8rem" }}>
                  Click "Add Slot" to add availability for this day
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button className="mt-4 pill-button btn-teal w-100" onClick={handleSave} disabled={availLoading}>
        {availLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Saving…
          </>
        ) : (
          <>
            <i className="bi bi-calendar-check me-2" />
            Save Availability
          </>
        )}
      </Button>
    </div>
  );
};

export default WeeklySchedule;
