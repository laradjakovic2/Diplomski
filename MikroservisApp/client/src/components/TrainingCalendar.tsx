import { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  SlotInfo,
  Event as CalendarEvent,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button } from "antd";
import { TrainingDto } from "../models/trainings";
import { ScoreType } from "../models/Enums";

const localizer = momentLocalizer(moment);

function FullCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TrainingDto | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const title = prompt("Naziv treninga?");

    if (title) {
      const newEvent: CalendarEvent = {
        //id: nextId,
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        //description: "Dodano ručno",
      };
      setEvents(events ? [...events, newEvent] : [newEvent]);
    }
  };

  useEffect(() => {
    const mockTrainings: TrainingDto[] = [
      {
        id: 1,
        title: "Snatch + Clean",
        startDate: new Date(2025, 5, 29, 10, 0),
        endDate: new Date(2025, 5, 29, 11, 30),
        description: "Snatch technique and clean complex",
        trainingTypeId: "1",
        trainerEmail: "gmail.com",
        trainerId: 1,
        scoreType: ScoreType.Reps,
      },
      {
        id: 2,
        title: "Metcon Madness",
        startDate: new Date(2025, 5, 28, 14, 0),
        endDate: new Date(2025, 5, 28, 15, 0),
        description: "30min AMRAP with rowing, burpees and box jumps",
        trainingTypeId: "1",
        trainerEmail: "gmail.com",
        trainerId: 1,
        scoreType: ScoreType.Reps,
      },
    ];

    const evs = mockTrainings.map((t) => {
      return {
        //id: t.id,
        title: t.title,
        start: t.startDate,
        end: t.endDate,
        //description: t.description,
      };
    });
    setEvents(evs);
  }, []);

  /*const handleSelectEvent = (event: CalendarEvent) => {
    const training = events.find((e) => e.id === event.id);
    if (training) setSelectedEvent(training);
  };*/

  return (
    <div
      style={{ padding: "24px", height: "calc(100vh - 64px)", width: "100%" }}
    >
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        defaultView={Views.WEEK}
        onSelectSlot={handleSelectSlot}
        //onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
      />

      <Modal
        title={selectedEvent?.title}
        open={!!selectedEvent}
        onCancel={() => setSelectedEvent(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedEvent(null)}>
            Zatvori
          </Button>,
        ]}
      >
        <p>
          <strong>Početak:</strong> {selectedEvent?.startDate.toLocaleString()}
        </p>
        <p>
          <strong>Kraj:</strong> {selectedEvent?.endDate.toLocaleString()}
        </p>
        <p>
          <strong>Opis:</strong> {selectedEvent?.description}
        </p>
      </Modal>
    </div>
  );
}

export default FullCalendar;
