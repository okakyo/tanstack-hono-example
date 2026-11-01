import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/pages/profile";

export const Route = createFileRoute("/(authenticated)/_authenticated/profile")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <ProfilePage />;
}
