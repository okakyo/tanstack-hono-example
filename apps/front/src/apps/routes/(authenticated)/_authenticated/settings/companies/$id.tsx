import { createFileRoute } from "@tanstack/react-router";
import { CompanyEditPage } from "@/pages/admin-setting-member/admin-setting-company-edit";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/settings/companies/$id",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompanyEditPage />;
}
