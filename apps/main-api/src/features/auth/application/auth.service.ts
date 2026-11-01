import type { AuthRepository } from "@/features/auth/auth.repository";
import { getAuthProfileUseCase } from "./usecases/get-auth-profile.usecase";
import { getAuthUserUseCase } from "./usecases/get-auth-user.usecase";
import { getAuthUserTenantsUseCase } from "./usecases/get-auth-user-tenants.usecase";
import { switchTenantUseCase } from "./usecases/switch-tenant.usecase";

export const authService = (repository: AuthRepository) => ({
  getUser: (authUserId: string) => getAuthUserUseCase(authUserId, repository),
  getUserTenants: (authUserId: string) =>
    getAuthUserTenantsUseCase(authUserId, repository),
  getProfile: (authUserId: string) =>
    getAuthProfileUseCase(authUserId, repository),
  switchTenant: (authUserId: string, tenantId: string) =>
    switchTenantUseCase({ authUserId, tenantId }, repository),
});

export type AuthService = ReturnType<typeof authService>;
