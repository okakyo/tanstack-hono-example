import { createFileRoute } from "@tanstack/react-router";
import { MemberCreatePage } from "@/pages/admin-setting-member-create";
import { requireAdminAccess } from "@/shareds/provider/auth/authQuery";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/members/create",
)({
  beforeLoad: async () => {
    await requireAdminAccess();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MemberCreatePage />;
}
