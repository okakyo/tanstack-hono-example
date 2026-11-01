import type {
  CreateTenantDto,
  DeleteTenantDto,
  GetTenantByIdDto,
  GetTenantsQueryDto,
  UpdateTenantDto,
} from "@/features/tenant/domains/tenant.input";
import type { Repository } from "@/features/tenant/tenant.repository";
import { createTenantUsecase } from "./usecases/create-tenant.usecase";
import { deleteTenantUsecase } from "./usecases/delete-tenant.usecase";
import { findTenantByIdUsecase } from "./usecases/find-tenant-by-id.usecase";
import { findTenantsUsecase } from "./usecases/find-tenants.usecase";
import { updateTenantUsecase } from "./usecases/update-tenant.usecase";

export const tenantService = (repository: Repository) => ({
  create: (input: CreateTenantDto) => createTenantUsecase(input, repository),
  update: (input: UpdateTenantDto) => updateTenantUsecase(input, repository),
  delete: (input: DeleteTenantDto) => deleteTenantUsecase(input, repository),
  findAll: (input: GetTenantsQueryDto) => findTenantsUsecase(input, repository),
  findById: (input: GetTenantByIdDto) =>
    findTenantByIdUsecase(input, repository),
});

export type TenantService = ReturnType<typeof tenantService>;
