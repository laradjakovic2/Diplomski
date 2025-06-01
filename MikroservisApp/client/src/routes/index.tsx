import { createFileRoute } from "@tanstack/react-router";
import CompetitionsGrid from "../components/competitions/CompetitionsGrid";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CompetitionsGrid />
    </>
  );
}
