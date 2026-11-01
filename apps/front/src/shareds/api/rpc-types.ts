import type {
  honoApiClient,
  InferRequestType,
  InferResponseType,
} from "@repo/main-api";

// TODO: 型運用のルールが未定であるため、どこかのタイミングで検討する
type UsersPut = (typeof honoApiClient.users)[":userId"]["$put"];

type CompaniesGet = typeof honoApiClient.companies.$get;
type MembersGet = typeof honoApiClient.members.$get;
type MembersSelectOptionsGet =
  (typeof honoApiClient.members)["select-options"]["$get"];
type InviteStatusesGet = (typeof honoApiClient)["invite-statuses"]["$get"];

export type UpdateUserDto = InferRequestType<UsersPut>["json"];

type CompaniesGetResponse = InferResponseType<CompaniesGet, 200>;
type MembersGetResponse = InferResponseType<MembersGet, 200>;
type MembersSelectOptionsGetResponse = InferResponseType<
  MembersSelectOptionsGet,
  200
>;
type InviteStatusesGetResponse = InferResponseType<InviteStatusesGet, 200>;

type ArrayItem<T> = NonNullable<T> extends readonly (infer U)[] ? U : never;

export type CompanyResponseData = ArrayItem<CompaniesGetResponse["data"]>;

export type MemberListItemResponseData = ArrayItem<MembersGetResponse["data"]>;
export type MemberSelectOptionResponseData = ArrayItem<
  MembersSelectOptionsGetResponse["data"]
>;

export type MemberRoleResponseData = ArrayItem<
  (typeof honoApiClient)["member-roles"]["$get"] extends infer R
    ? InferResponseType<R, 200>["data"]
    : never
>;

export type InviteStatusResponseData = ArrayItem<
  InviteStatusesGetResponse["data"]
>;
