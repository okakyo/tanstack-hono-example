import * as v from "valibot";

const INVALID_INTEGER_MESSAGE = "整数を指定してください";
const MIN_PAGE_VALUE = 1;
const MAX_LIMIT_VALUE = 100;
const INVALID_BOOLEAN_MESSAGE = "true または false を指定してください";

const queryIntegerSchema = v.pipe(
  v.union([v.string(), v.number()]),
  v.transform((input) => (typeof input === "number" ? input : Number(input))),
  v.check((input) => Number.isInteger(input), INVALID_INTEGER_MESSAGE),
  v.minValue(MIN_PAGE_VALUE),
);

const queryBooleanSchema = v.pipe(
  v.union([v.boolean(), v.string()]),
  v.transform((input) => {
    if (typeof input === "boolean") {
      return input;
    }

    if (input === "true") {
      return true;
    }

    if (input === "false") {
      return false;
    }

    return input;
  }),
  v.boolean(INVALID_BOOLEAN_MESSAGE),
);

/**
 * 境界層の DTO 群。
 * Domain Entity ではなく、HTTP / repository との受け渡しに使う最小の入力契約を定義する。
 */
export const getCompaniesQueryDtoSchema = v.object({
  limit: v.optional(v.pipe(queryIntegerSchema, v.maxValue(MAX_LIMIT_VALUE))),
  page: v.optional(queryIntegerSchema),
  sortBy: v.optional(v.string()),
  orderBy: v.optional(v.union([v.literal("asc"), v.literal("desc")])),
  name: v.optional(v.string()),
  companyPlanId: v.optional(v.string()),
  isSupplier: v.optional(queryBooleanSchema),
  excludeCompanyId: v.optional(v.string()),
});

export const createCompanyDtoSchema = v.object({
  name: v.string(),
  companyPlanId: v.optional(v.nullable(v.string())),
  isSupplier: v.optional(v.boolean()),
  phone: v.optional(v.nullable(v.string())),
  address: v.optional(v.nullable(v.string())),
  thumbnail: v.optional(v.nullable(v.string())),
});

export const updateCompanyDtoSchema = v.object({
  name: v.optional(v.string()),
  companyPlanId: v.optional(v.nullable(v.string())),
  isSupplier: v.optional(v.boolean()),
  phone: v.optional(v.nullable(v.string())),
  address: v.optional(v.nullable(v.string())),
  thumbnail: v.optional(v.nullable(v.string())),
});

export const deleteCompanyDtoSchema = v.object({
  id: v.string(),
});

export const getCompanyByIdDtoSchema = v.object({
  id: v.string(),
});

export type GetCompaniesQueryDto = v.InferOutput<
  typeof getCompaniesQueryDtoSchema
>;
export type CreateCompanyDto = v.InferOutput<typeof createCompanyDtoSchema>;
export type UpdateCompanyDto = v.InferOutput<typeof updateCompanyDtoSchema>;
export type DeleteCompanyDto = v.InferOutput<typeof deleteCompanyDtoSchema>;
export type GetCompanyByIdDto = v.InferOutput<typeof getCompanyByIdDtoSchema>;
