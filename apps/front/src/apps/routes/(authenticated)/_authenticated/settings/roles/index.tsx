import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingRolePage } from "@/pages/admin-setting-role/AdminSettingRoleContainer";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/roles/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminSettingRolePage />;
}
