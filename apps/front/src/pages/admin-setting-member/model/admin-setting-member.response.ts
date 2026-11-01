import type { honoApiClient, InferResponseType } from "@repo/main-api";

type MembersGet = typeof honoApiClient.members.$get;
type InviteStatusesGet = (typeof honoApiClient)["invite-statuses"]["$get"];
type MembersGetResponse = InferResponseType<MembersGet, 200>;
type InviteStatusesGetResponse = InferResponseType<InviteStatusesGet, 200>;
type ArrayItem<T> = NonNullable<T> extends readonly (infer U)[] ? U : never;

export type MemberGetRecordResponse = ArrayItem<MembersGetResponse["data"]>;
export type MemberListItemEntity = MemberGetRecordResponse;
export type InviteStatusEntity = ArrayItem<InviteStatusesGetResponse["data"]>;
