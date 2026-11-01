import type { honoApiClient, InferRequestType } from "@repo/main-api";

type UsersPut = (typeof honoApiClient.users)[":userId"]["$put"];

export type UpdateUserDto = InferRequestType<UsersPut>["json"];
