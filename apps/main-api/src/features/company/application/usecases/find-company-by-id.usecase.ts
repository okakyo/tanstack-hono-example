import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { CompanyEntity } from "@/features/company/domains/company.entity";
import type { GetCompanyByIdDto } from "@/features/company/domains/company.input";
import type { CompanyRepository } from "../../company.repository";
import { toCompanyEntity } from "./company-entity.mapper";

export type FindCompanyByIdResult = Result<CompanyEntity | null, HTTPException>;

type FindCompanyByIdParams = GetCompanyByIdDto & {
  tenantId: string;
};

export const findCompanyByIdUseCase =
  (repository: CompanyRepository) =>
  async (input: FindCompanyByIdParams): Promise<FindCompanyByIdResult> => {
    try {
      const company = await repository.findById(input.id, input.tenantId);
      if (!company) {
        return err(new HTTPException(404, { message: "Company not found" }));
      }

      return ok(toCompanyEntity(company));
    } catch (error) {
      return err(
        new HTTPException(500, {
          message:
            error instanceof Error ? error.message : "Internal server error",
        }),
      );
    }
  };
