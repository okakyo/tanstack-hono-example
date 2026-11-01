import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { useCompanyService } from "./application/company.service";

export const COMPANY_SERVICE_KEY = "companyService";

export const createCompanyModule = (repository: Repository) => {
  const { companyRepository } = repository;
  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(COMPANY_SERVICE_KEY, useCompanyService(companyRepository));
    await next();
  });
};

export type CompanyModule = ReturnType<typeof createCompanyModule>;
