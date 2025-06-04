import { createFileRoute } from "@tanstack/react-router";
import TrainingDetails from "../../components/trainings/TrainingDetails";

export const Route = createFileRoute("/trainings/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TrainingDetails />
    </>
  );
}
