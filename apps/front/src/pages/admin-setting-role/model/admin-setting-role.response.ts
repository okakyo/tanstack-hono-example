import type { honoApiClient, InferResponseType } from "@repo/main-api";

type MemberRolesGet = (typeof honoApiClient)["member-roles"]["$get"];
type MemberRolesGetResponse = InferResponseType<MemberRolesGet, 200>;

/** ロール一覧 API の 1 件分のレスポンス型 */
export type MemberRoleEntity = MemberRolesGetResponse["data"][number];
