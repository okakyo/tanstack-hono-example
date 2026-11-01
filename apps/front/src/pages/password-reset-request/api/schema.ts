import * as v from "valibot";

export const resetPasswordRequestInputDtoSchema = v.object({
  email: v.pipe(
    v.string("メールアドレスを入力してください"),
    v.email("有効なメールアドレスを入力してください"),
  ),
});

export type ResetPasswordRequestInputDto = v.InferOutput<
  typeof resetPasswordRequestInputDtoSchema
>;
