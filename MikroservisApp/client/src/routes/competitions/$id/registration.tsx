import { createFileRoute } from "@tanstack/react-router";
import CompetitionRegistration from "../../../components/competitions/CompetitionRegistration";

export const Route = createFileRoute("/competitions/$id/registration")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <CompetitionRegistration />
    </div>
  );
}
