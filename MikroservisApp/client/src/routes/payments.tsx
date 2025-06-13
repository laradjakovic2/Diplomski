import { createFileRoute } from "@tanstack/react-router";
import Payments from "../components/payments/Payments";

export const Route = createFileRoute("/payments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Payments />
    </>
  );
}
