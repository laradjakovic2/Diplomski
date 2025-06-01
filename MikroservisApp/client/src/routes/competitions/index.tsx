import { createFileRoute } from "@tanstack/react-router";
import Competitions from "../../components/competitions/Competitions";

export const Route = createFileRoute("/competitions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Competitions />
    </>
  );
}
