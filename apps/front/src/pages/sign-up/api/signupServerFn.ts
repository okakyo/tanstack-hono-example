import { createServerFn } from "@tanstack/react-start";
import { signUpWithPassword } from "@/shareds/api";
import { SignUpInputDtoSchema } from "./schema";

export const signupServerFn = createServerFn()
  .inputValidator(SignUpInputDtoSchema)
  .handler(async ({ data }) => {
    return await signUpWithPassword({
      email: data.email,
      password: data.password,
    });
  });
