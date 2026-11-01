import type { InviteStatusRepository } from "@/features/invite-status/invite-status.repository";
import { findInviteStatusesUseCase } from "./usecases/find-invite-statuses.usecase";

export const inviteStatusService = (repository: InviteStatusRepository) => ({
  find: findInviteStatusesUseCase(repository),
});

export type InviteStatusService = ReturnType<typeof inviteStatusService>;
