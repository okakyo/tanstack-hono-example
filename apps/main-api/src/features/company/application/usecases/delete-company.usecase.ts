import { HTTPException } from "hono/http-exception";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";
import type { DeleteCompanyDto } from "@/features/company/domains/company.input";
import type { CompanyRepository } from "../../company.repository";

export type DeleteCompanyResult = Result<{ message: string }, HTTPException>;

type DeleteCompanyParams = DeleteCompanyDto & {
  tenantId: string;
};

export const deleteCompanyUseCase =
  (repository: CompanyRepository) =>
  async (input: DeleteCompanyParams): Promise<DeleteCompanyResult> => {
    try {
      const company = await repository.findById(input.id, input.tenantId);
      if (!company) {
        return err(new HTTPException(404, { message: "Company not found" }));
      }

      const deleted = await repository.delete(input.id, input.tenantId);
      if (!deleted) {
        return err(
          new HTTPException(500, { message: "Failed to delete company" }),
        );
      }

      return ok({ message: "Company deleted successfully" });
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
