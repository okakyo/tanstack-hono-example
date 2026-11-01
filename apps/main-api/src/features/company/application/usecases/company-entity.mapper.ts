import type { CompanyEntity } from "@/features/company/domains/company.entity";

type CompanyWithPlanRecord = {
  company: {
    id: string;
    name: string;
    isSupplier?: boolean | null;
    phone: string | null;
    address: string | null;
    thumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
  company_plan: {
    id: string;
    name: string;
  } | null;
};

/**
 * repository の join 結果を API の CompanyEntity へ変換します。
 */
export const toCompanyEntity = (
  record: CompanyWithPlanRecord,
): CompanyEntity => ({
  ...record.company,
  isSupplier: record.company.isSupplier ?? false,
  companyPlan: record.company_plan
    ? {
        id: record.company_plan.id,
        name: record.company_plan.name,
      }
    : null,
  createdAt: record.company.createdAt,
  updatedAt: record.company.updatedAt,
});
