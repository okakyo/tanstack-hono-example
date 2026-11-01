import type { Repository } from "@/features/member/member.repository";
import { createMemberUsecase } from "./usecases/create-member.usecase";
import { deleteMemberUsecase } from "./usecases/delete-member.usecase";
import { findMemberByIdUsecase } from "./usecases/find-member-by-id.usecase";
import { findMemberSelectOptionsUsecase } from "./usecases/find-member-select-options.usecase";
import { findMembersUsecase } from "./usecases/find-members.usecase";
import { updateMemberUsecase } from "./usecases/update-member.usecase";

export const memberService = (repository: Repository) => ({
  create: (input: Parameters<typeof createMemberUsecase>[0]) =>
    createMemberUsecase(input, repository),
  update: (input: Parameters<typeof updateMemberUsecase>[0]) =>
    updateMemberUsecase(input, repository),
  delete: (input: Parameters<typeof deleteMemberUsecase>[0]) =>
    deleteMemberUsecase(input, repository),
  findAll: (input: Parameters<typeof findMembersUsecase>[0]) =>
    findMembersUsecase(input, repository),
  findSelectOptions: (
    input: Parameters<typeof findMemberSelectOptionsUsecase>[0],
  ) => findMemberSelectOptionsUsecase(input, repository),
  findById: (input: Parameters<typeof findMemberByIdUsecase>[0]) =>
    findMemberByIdUsecase(input, repository),
});

export type MemberService = ReturnType<typeof memberService>;
