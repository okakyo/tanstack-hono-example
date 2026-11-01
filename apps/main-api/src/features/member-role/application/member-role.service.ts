import type { Repository } from "@/features/member-role/member-role.repository";
import { createMemberRoleUsecase } from "./usecases/create-member-role.usecase";
import { deleteMemberRoleUsecase } from "./usecases/delete-member-role.usecase";
import { findMemberRoleByIdUsecase } from "./usecases/find-member-role-by-id.usecase";
import { findMemberRolesUsecase } from "./usecases/find-member-roles.usecase";
import { updateMemberRoleUsecase } from "./usecases/update-member-role.usecase";

export const memberRoleService = (repository: Repository) => ({
  create: (input: Parameters<typeof createMemberRoleUsecase>[0]) =>
    createMemberRoleUsecase(input, repository),
  update: (input: Parameters<typeof updateMemberRoleUsecase>[0]) =>
    updateMemberRoleUsecase(input, repository),
  delete: (input: Parameters<typeof deleteMemberRoleUsecase>[0]) =>
    deleteMemberRoleUsecase(input, repository),
  findAll: (input: Parameters<typeof findMemberRolesUsecase>[0]) =>
    findMemberRolesUsecase(input, repository),
  findById: (input: Parameters<typeof findMemberRoleByIdUsecase>[0]) =>
    findMemberRoleByIdUsecase(input, repository),
});

export type MemberRoleService = ReturnType<typeof memberRoleService>;
