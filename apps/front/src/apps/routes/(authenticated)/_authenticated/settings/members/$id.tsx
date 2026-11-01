import { createFileRoute } from "@tanstack/react-router";
import { MemberEditPage } from "@/pages/admin-setting-member-edit";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/members/$id",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <MemberEditPage />;
}
