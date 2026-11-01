import { createFileRoute } from "@tanstack/react-router";
import { PasswordResetRequestPage } from "@/pages/password-reset-request";

export const Route = createFileRoute("/(auth)/password-reset-request")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PasswordResetRequestPage />;
}
