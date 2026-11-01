import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import * as v from "valibot";
import {
  type CompanyEntity,
  companyEntitySchema,
} from "@/features/company/domains/company.entity";
import type { CreateCompanyDto } from "@/features/company/domains/company.input";
import type { CompanyRepository } from "../../company.repository";
import { toCompanyEntity } from "./company-entity.mapper";

export type CreateCompanyResult = Result<CompanyEntity, HTTPException>;

type CreateCompanyUseCaseInput = CreateCompanyDto & {
  tenantId: string;
};

export const createCompanyUseCase =
  (repository: CompanyRepository) =>
  async (input: CreateCompanyUseCaseInput): Promise<CreateCompanyResult> => {
    try {
      const created = await repository.create(input);
      if (!created) {
        return err(
          new HTTPException(500, { message: "Failed to create company" }),
        );
      }

      const createdCompany = await repository.findById(
        created.id,
        input.tenantId,
      );
      if (!createdCompany) {
        return err(
          new HTTPException(500, {
            message: "Created company could not be loaded",
          }),
        );
      }

      // Parser を利用して、期待した値が取得できることを検証する
      const parsedCompany = v.safeParse(
        companyEntitySchema,
        toCompanyEntity(createdCompany),
      );

      if (!parsedCompany.success) {
        return err(
          new HTTPException(500, {
            message: "Created company data is invalid",
          }),
        );
      }

      return ok(parsedCompany.output);
    } catch (error) {
      return err(
        new HTTPException(500, {
          message:
            error instanceof Error ? error.message : "Internal server error",
        }),
      );
    }
  };
