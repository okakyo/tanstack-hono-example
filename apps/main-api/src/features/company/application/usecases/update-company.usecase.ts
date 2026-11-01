import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type CompanyEntity,
  companyEntitySchema,
} from "@/features/company/domains/company.entity";
import type { UpdateCompanyDto } from "@/features/company/domains/company.input";
import type { CompanyRepository } from "../../company.repository";
import { toCompanyEntity } from "./company-entity.mapper";

export type UpdateCompanyResult = Result<CompanyEntity, HTTPException>;

type UpdateCompanyParams = UpdateCompanyDto & {
  id: string;
  tenantId: string;
};

export const updateCompanyUseCase =
  (repository: CompanyRepository) =>
  async (input: UpdateCompanyParams): Promise<UpdateCompanyResult> => {
    const { id, tenantId, ...updateData } = input;
    try {
      const company = await repository.findById(id, tenantId);
      if (!company) {
        return err(new HTTPException(404, { message: "Company not found" }));
      }

      const updated = await repository.update(id, updateData);
      if (!updated) {
        return err(new HTTPException(404, { message: "Company not found" }));
      }

      const refreshedCompany = await repository.findById(id, tenantId);
      if (!refreshedCompany) {
        return err(new HTTPException(404, { message: "Company not found" }));
      }

      // Parser を利用して、期待した値が取得できることを検証する
      const parsedCompany = v.safeParse(
        companyEntitySchema,
        toCompanyEntity(refreshedCompany),
      );

      if (!parsedCompany.success) {
        return err(
          new HTTPException(500, {
            message: "Updated company data is invalid",
          }),
        );
      }

      return ok(parsedCompany.output);
    } catch (error) {
      if (error instanceof HTTPException) {
        return err(error);
      }
      return err(
        new HTTPException(500, {
          message:
            error instanceof Error ? error.message : "Internal server error",
        }),
      );
    }
  };
