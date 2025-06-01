import { useCallback, useEffect, useState } from "react";
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
import TrainingForm from "./TrainingForm";
import {
  getAllTrainings,
  registerUserForTraining,
} from "../../api/trainingsService";
import dayjs from "dayjs";
import { UserRegisteredForTraining } from "../../models/trainings";

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

  const handleRegisterForTraining = useCallback(async () => {
    const command: UserRegisteredForTraining = {
      userId: 1,
      trainingId: 1,
      userEmail: "lara.dakovic@fer.hr",
    };

    await registerUserForTraining(command);

    handleCloseDrawer();
  }, []);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getAllTrainings();

        const evs = data.map((t) => {
          return {
            //id: t.id,
            title: t.title,
            start: dayjs(t.startDate).toDate(),
            end: dayjs(t.endDate).toDate(),
            description: t.description,
          };
        });

        setEvents(evs);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrainings();
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
          <>
            <Button key="close" onClick={handleCloseDrawer}>
              Close
            </Button>
            <Button
              key="add"
              type="primary"
              onClick={handleRegisterForTraining}
            >
              Register for training
            </Button>
          </>,
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
