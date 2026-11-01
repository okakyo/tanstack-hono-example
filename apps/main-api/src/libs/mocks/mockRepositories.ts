import { type Mocked, vi } from "vitest";
import type { CompanyRepository } from "@/features/company/company.repository";
import type { InviteStatusRepository } from "@/features/invite-status/invite-status.repository";
import type { UserRepository } from "@/features/user/user.repository";

export const mockCompanyRepository: Mocked<CompanyRepository> = {
  find: vi.fn(),
  findById: vi.fn(),
  isDeleted: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

export const mockInviteStatusRepository: Mocked<InviteStatusRepository> = {
  find: vi.fn(),
};

export const mockUserRepository: Mocked<UserRepository> = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findByAuthUserId: vi.fn(),
  findByAuthUserIdWithMembers: vi.fn(),
  isMemberOfTenant: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
