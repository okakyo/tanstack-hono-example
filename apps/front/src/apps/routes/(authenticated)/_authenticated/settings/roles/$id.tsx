import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/roles/$id",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(authenticated)/_authenticated/settings/roles/$id"!</div>;
}
