import { createFileRoute } from "@tanstack/react-router";
import { requireAdminAccess } from "@/shareds/provider/auth/authQuery";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/roles/create",
)({
  beforeLoad: async () => {
    await requireAdminAccess();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/(authenticated)/_authenticated/settings/roles/create"!</div>
  );
}
