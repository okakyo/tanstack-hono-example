import * as v from "valibot";

export const loginInputDtoSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

export type LoginInputDto = v.InferOutput<typeof loginInputDtoSchema>;
