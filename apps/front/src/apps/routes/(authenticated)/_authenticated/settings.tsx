import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAdminAccess } from "@/shareds/provider/auth/authQuery";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings",
)({
  beforeLoad: async () => {
    await requireAdminAccess();
  },
  component: SettingsRoute,
});

function SettingsRoute() {
  return <Outlet />;
}
