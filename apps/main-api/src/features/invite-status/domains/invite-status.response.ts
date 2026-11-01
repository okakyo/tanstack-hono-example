import * as v from "valibot";
import { inviteStatusEntitySchema } from "./invite-status.entity";

export const inviteStatusResponseSchema = inviteStatusEntitySchema;

export const findInviteStatusesResponseSchema = v.array(
  v.pick(inviteStatusResponseSchema, ["id", "code", "name", "description"]),
);

export type FindInviteStatusesResponse = v.InferOutput<
  typeof findInviteStatusesResponseSchema
>;
