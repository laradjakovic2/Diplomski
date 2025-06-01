import { createFileRoute } from "@tanstack/react-router";
import TrainingCalendar from "../components/trainings/TrainingCalendar";

export const Route = createFileRoute("/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TrainingCalendar />
    </>
  );
}
