import { useEffect, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  Event as CalendarEvent,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Drawer } from "antd";
import { TrainingDto } from "../../models/trainings";
import { ScoreType } from "../../models/Enums";
import TrainingForm from "./TrainingForm";

const localizer = momentLocalizer(moment);

function FullCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [isTrainingFormVisible, setIsTrainingFormVisible] =
    useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const newEvent: CalendarEvent = {
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
    };
    setSelectedEvent(newEvent);
    setIsTrainingFormVisible(true);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(undefined);
    setIsTrainingFormVisible(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    const mockTrainings: TrainingDto[] = [
      {
        id: 1,
        title: "Snatch + Clean",
        startDate: new Date(2025, 4, 29, 10, 0),
        endDate: new Date(2025, 4, 29, 11, 30),
        description: "Snatch technique and clean complex",
        trainingTypeId: "1",
        trainerEmail: "gmail.com",
        trainerId: 1,
        scoreType: ScoreType.Reps,
      },
      {
        id: 2,
        title: "Metcon Madness",
        startDate: new Date(2025, 4, 28, 14, 0),
        endDate: new Date(2025, 4, 28, 15, 0),
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
        description: t.description,
      };
    });
    setEvents(evs);
  }, []);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  return (
    <div
      style={{ padding: "24px", height: "calc(100vh - 64px)", width: "100%" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        defaultView={Views.WEEK}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
      />

      <Modal
        title={selectedEvent?.title}
        open={!!isModalVisible}
        onCancel={handleCloseDrawer}
        footer={[
          <Button key="close" onClick={handleCloseDrawer}>
            Zatvori
          </Button>,
        ]}
      >
        <p>
          <strong>Početak:</strong> {selectedEvent?.start?.toLocaleString()}
        </p>
        <p>
          <strong>Kraj:</strong> {selectedEvent?.end?.toLocaleString()}
        </p>
      </Modal>

      <Drawer
        title={"Create"}
        open={!!isTrainingFormVisible}
        onClose={handleCloseDrawer}
        destroyOnClose
        width={700}
      >
        <TrainingForm onClose={handleCloseDrawer} />
      </Drawer>
    </div>
  );
}

export default FullCalendar;
