import type { CompanyPlanRepository } from "@/features/company-plan/company-plan.repository";
import type {
  CreateCompanyPlanDto,
  DeleteCompanyPlanDto,
  GetCompanyPlanByIdDto,
  GetCompanyPlansQueryDto,
  UpdateCompanyPlanDto,
} from "@/features/company-plan/domains/company-plan.input";
import { createCompanyPlanUsecase } from "./usecases/create-company-plan.usecase";
import { deleteCompanyPlanUsecase } from "./usecases/delete-company-plan.usecase";
import { findCompanyPlanByIdUsecase } from "./usecases/find-company-plan-by-id.usecase";
import { findCompanyPlansUsecase } from "./usecases/find-company-plans.usecase";
import { updateCompanyPlanUsecase } from "./usecases/update-company-plan.usecase";

export const companyPlanService = (repository: CompanyPlanRepository) => ({
  create: (input: CreateCompanyPlanDto) =>
    createCompanyPlanUsecase(input, repository),
  update: (input: UpdateCompanyPlanDto) =>
    updateCompanyPlanUsecase(input, repository),
  delete: (input: DeleteCompanyPlanDto) =>
    deleteCompanyPlanUsecase(input, repository),
  findAll: (input: GetCompanyPlansQueryDto) =>
    findCompanyPlansUsecase(input, repository),
  findById: (input: GetCompanyPlanByIdDto) =>
    findCompanyPlanByIdUsecase(input, repository),
});

export type CompanyPlanService = ReturnType<typeof companyPlanService>;
