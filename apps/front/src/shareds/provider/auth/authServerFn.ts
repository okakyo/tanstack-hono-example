import { createServerFn } from "@tanstack/react-start";
import { getAuthSession } from "@/shareds/api";

export const authServerFn = createServerFn().handler(async () => {
  return await getAuthSession();
});
