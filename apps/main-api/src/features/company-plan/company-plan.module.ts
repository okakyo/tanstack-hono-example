import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/app.env";
import type { Repository } from "@/repositories";
import { companyPlanService } from "./application/company-plan.service";

export const COMPANY_PLAN_SERVICE_KEY = "companyPlanService";

export const createCompanyPlanModule = (repository: Repository) => {
  const { companyPlanRepository } = repository;
  return createMiddleware<AppEnv>(async (c, next) => {
    c.set(COMPANY_PLAN_SERVICE_KEY, companyPlanService(companyPlanRepository));
    await next();
  });
};

export type CompanyPlanModule = ReturnType<typeof createCompanyPlanModule>;
