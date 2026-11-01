import * as v from "valibot";

export const resetPasswordInputDtoSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string("パスワードを入力してください"),
      v.minLength(8, "パスワードは8文字以上である必要があります"),
    ),
    confirmPassword: v.string("確認用パスワードを入力してください"),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "パスワードが一致しません",
    ),
    ["confirmPassword"],
  ),
);

export type ResetPasswordInputDto = v.InferOutput<
  typeof resetPasswordInputDtoSchema
>;
