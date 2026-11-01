import type { honoApiClient, InferResponseType } from "@repo/main-api";

type CompaniesGet = typeof honoApiClient.companies.$get;
type CompaniesGetResponse = InferResponseType<CompaniesGet, 200>;
type ArrayItem<T> = NonNullable<T> extends readonly (infer U)[] ? U : never;

export type CompanyEntity = ArrayItem<CompaniesGetResponse["data"]>;
