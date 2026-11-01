import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingMemberPage } from "@/pages/admin-setting-member/AdminSettingMemberContainer";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/members/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminSettingMemberPage />;
}
