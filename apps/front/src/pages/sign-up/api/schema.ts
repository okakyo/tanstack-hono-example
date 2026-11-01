import * as v from "valibot";

export const SignUpInputDtoSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
  confirmPassword: v.string(),
});

export type SignUpInputDto = v.InferOutput<typeof SignUpInputDtoSchema>;
