import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockCompanyRepository } from "../../../../libs/mocks/mockRepositories";
import {
  createCompanyDtoSchema,
  getCompaniesQueryDtoSchema,
} from "../../company.schema";
import { deleteCompanyUseCase } from "./delete-company.usecase";
import { findCompaniesUseCase } from "./find-companies.usecase";
import { findCompanyByIdUseCase } from "./find-company-by-id.usecase";
import { updateCompanyUseCase } from "./update-company.usecase";

describe("company usecases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createCompanyDtoSchema", () => {
    it("isSupplier を受け取り、保持できる", () => {
      const result = v.safeParse(createCompanyDtoSchema, {
        name: "会社1",
        companyPlanId: "plan-1",
        isSupplier: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output.isSupplier).toBe(true);
      }
    });

    it("companyPlanId が未指定でもパースできる", () => {
      const result = v.safeParse(createCompanyDtoSchema, {
        name: "会社1",
      });

      expect(result.success).toBe(true);
    });

    it("companyPlanId に null を指定できる", () => {
      const result = v.safeParse(createCompanyDtoSchema, {
        name: "会社1",
        companyPlanId: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("getCompaniesQueryDtoSchema", () => {
    it("isSupplier は Boolean に変換した boolean を受け取れる", () => {
      const result = v.safeParse(getCompaniesQueryDtoSchema, {
        isSupplier: Boolean("true"),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output.isSupplier).toBe(true);
      }
    });
  });

  describe("findCompaniesUseCase", () => {
    it("excludeCompanyId を指定するとその会社を一覧から除外できる", async () => {
      mockCompanyRepository.find.mockResolvedValue([]);
      mockCompanyRepository.count.mockResolvedValue(0);

      const result = await findCompaniesUseCase(mockCompanyRepository)({
        tenantId: "tenant-1",
        excludeCompanyId: "company-1",
      });

      expect(result.isOk()).toBe(true);
      expect(mockCompanyRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
          limit: 50,
          offset: 0,
        }),
      );
      expect(mockCompanyRepository.count).toHaveBeenCalledWith(
        expect.anything(),
      );
    });
  });

  describe("findCompanyByIdUseCase", () => {
    it("tenantId 一致の会社を取得できる", async () => {
      mockCompanyRepository.findById.mockResolvedValue({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: "plan-1",
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
        },
        company_plan: {
          id: "plan-1",
          name: "ベーシック",
        },
      });

      const result = await findCompanyByIdUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-1",
      });

      expect(result.isOk()).toBe(true);
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(
        "company-1",
        "tenant-1",
      );
    });

    it("tenantId が一致しない場合は 404 を返す", async () => {
      mockCompanyRepository.findById.mockResolvedValue(null);

      const result = await findCompanyByIdUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-2",
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(HTTPException);
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(
        "company-1",
        "tenant-2",
      );
    });

    it("companyPlanId が null の会社も取得できる", async () => {
      mockCompanyRepository.findById.mockResolvedValue({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: null,
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
        },
        company_plan: null,
      });

      const result = await findCompanyByIdUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-1",
      });

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().companyPlan).toBeNull();
    });
  });

  describe("updateCompanyUseCase", () => {
    it("tenantId 一致の会社を更新できる", async () => {
      mockCompanyRepository.findById.mockResolvedValue({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: "plan-1",
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
        },
        company_plan: {
          id: "plan-1",
          name: "ベーシック",
        },
      });
      mockCompanyRepository.update.mockResolvedValue({
        id: "company-1",
        tenantId: "tenant-1",
        name: "会社1-更新",
        companyPlanId: "plan-2",
        phone: null,
        address: null,
        thumbnail: null,
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-03T00:00:00Z").toISOString(),
        createdBy: "user-1",
        updatedBy: "user-2",
        isParent: false,
      });

      const result = await updateCompanyUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-1",
        name: "会社1-更新",
        companyPlanId: "plan-2",
      });

      expect(result.isOk()).toBe(true);
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(
        "company-1",
        "tenant-1",
      );
      expect(mockCompanyRepository.update).toHaveBeenCalledWith("company-1", {
        name: "会社1-更新",
        companyPlanId: "plan-2",
      });
    });

    it("tenantId が一致しない場合は更新しない", async () => {
      mockCompanyRepository.findById.mockResolvedValue(null);

      const result = await updateCompanyUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-2",
        name: "会社1-更新",
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(HTTPException);
      expect(mockCompanyRepository.update).not.toHaveBeenCalled();
    });

    it("isSupplier を保持して会社を更新できる", async () => {
      mockCompanyRepository.findById.mockResolvedValue({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: "plan-1",
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
          isSupplier: true,
        },
        company_plan: {
          id: "plan-1",
          name: "ベーシック",
        },
      });
      mockCompanyRepository.update.mockResolvedValue({
        id: "company-1",
        tenantId: "tenant-1",
        name: "会社1",
        companyPlanId: "plan-1",
        phone: null,
        address: null,
        thumbnail: null,
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-03T00:00:00Z").toISOString(),
        createdBy: "user-1",
        updatedBy: "user-1",
        isParent: false,
        isSupplier: true,
      });
      mockCompanyRepository.findById.mockResolvedValueOnce({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: "plan-1",
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
          isSupplier: true,
        },
        company_plan: {
          id: "plan-1",
          name: "ベーシック",
        },
      });

      const result = await updateCompanyUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-1",
        name: "会社1",
        isSupplier: true,
      });

      expect(result.isOk()).toBe(true);
      expect(mockCompanyRepository.update).toHaveBeenCalledWith("company-1", {
        name: "会社1",
        isSupplier: true,
      });
    });
  });

  describe("deleteCompanyUseCase", () => {
    it("tenantId 一致の会社を削除できる", async () => {
      mockCompanyRepository.findById.mockResolvedValue({
        company: {
          id: "company-1",
          tenantId: "tenant-1",
          name: "会社1",
          companyPlanId: "plan-1",
          phone: null,
          address: null,
          thumbnail: null,
          createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
          createdBy: "user-1",
          updatedBy: "user-1",
          isParent: false,
        },
        company_plan: {
          id: "plan-1",
          name: "ベーシック",
        },
      });
      mockCompanyRepository.delete.mockResolvedValue(true);

      const result = await deleteCompanyUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-1",
      });

      expect(result.isOk()).toBe(true);
      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(
        "company-1",
        "tenant-1",
      );
      expect(mockCompanyRepository.delete).toHaveBeenCalledWith(
        "company-1",
        "tenant-1",
      );
    });

    it("tenantId が一致しない場合は削除しない", async () => {
      mockCompanyRepository.findById.mockResolvedValue(null);

      const result = await deleteCompanyUseCase(mockCompanyRepository)({
        id: "company-1",
        tenantId: "tenant-2",
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(HTTPException);
      expect(mockCompanyRepository.delete).not.toHaveBeenCalled();
    });
  });
});
