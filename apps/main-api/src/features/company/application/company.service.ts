import type { CompanyRepository } from "../company.repository";

import { createCompanyUseCase } from "./usecases/create-company.usecase";
import { deleteCompanyUseCase } from "./usecases/delete-company.usecase";
import { findCompaniesUseCase } from "./usecases/find-companies.usecase";
import { findCompanyByIdUseCase } from "./usecases/find-company-by-id.usecase";
import { updateCompanyUseCase } from "./usecases/update-company.usecase";

export const useCompanyService = (companyRepository: CompanyRepository) => {
  return {
    find: findCompaniesUseCase(companyRepository),
    findById: findCompanyByIdUseCase(companyRepository),
    create: createCompanyUseCase(companyRepository),
    update: updateCompanyUseCase(companyRepository),
    delete: deleteCompanyUseCase(companyRepository),
  };
};

export type CompanyService = ReturnType<typeof useCompanyService>;
