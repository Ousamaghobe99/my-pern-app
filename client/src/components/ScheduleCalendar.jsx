import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import timeGridPlugin from "@fullcalendar/timegrid";
import { useScheduleEvents } from "../hooks/useApi";
import { startOfWeek, endOfWeek } from "date-fns";

const ScheduleCalendar = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: events = [], isLoading } = useScheduleEvents({
    startDate,
    endDate,
  });

  if (isLoading) return <p>Loading schedule...</p>;

  // Map API events to FullCalendar format
  const calendarEvents = events.map((ev) => ({
    id: ev.id,
    title: ev.title,
    start: ev.start,
    end: ev.end,
    color: ev.type === "maintenance" ? "#f87171" : "#60a5fa", // red / blue
    extendedProps: ev.details,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridWeek,dayGridMonth",
        }}
        events={calendarEvents}
        eventContent={(arg) => (
          <div className="text-xs truncate">
            {arg.event.title}
          </div>
        )}
        height="auto"
      />
    </div>
  );
};

export default ScheduleCalendar;
