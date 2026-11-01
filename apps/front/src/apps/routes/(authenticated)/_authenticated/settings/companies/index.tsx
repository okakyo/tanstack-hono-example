import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingCompanyPage } from "@/pages/admin-setting-company/AdminSettingCompanyContainer";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/companies/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminSettingCompanyPage />;
}
