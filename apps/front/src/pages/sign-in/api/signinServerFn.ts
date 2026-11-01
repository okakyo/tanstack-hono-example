import { createServerFn } from "@tanstack/react-start";
import { signInWithPassword } from "@/shareds/api";
import { loginInputDtoSchema } from "./schema";

export const signinServerFn = createServerFn()
  .inputValidator(loginInputDtoSchema)
  .handler(async ({ data }) => {
    return await signInWithPassword({
      email: data.email,
      password: data.password,
    });
  });
