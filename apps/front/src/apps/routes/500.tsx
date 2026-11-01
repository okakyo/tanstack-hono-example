import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/500")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/500"!</div>;
}
