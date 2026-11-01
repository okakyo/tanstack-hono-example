import { createFileRoute } from "@tanstack/react-router";
import { CompanyCreatePage } from "@/pages/admin-setting-company-create";
import { requireAdminAccess } from "@/shareds/provider/auth/authQuery";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/companies/create",
)({
  beforeLoad: async () => {
    await requireAdminAccess();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CompanyCreatePage />;
}
