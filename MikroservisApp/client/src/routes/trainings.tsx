import { createFileRoute } from "@tanstack/react-router";
import Trainings from "../components/Trainings";

export const Route = createFileRoute("/trainings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Trainings />
  );
}
