import * as v from "valibot";

export const loginInputDtoSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

export type LoginInputDto = v.InferOutput<typeof loginInputDtoSchema>;

// TODO: SignUp にはパスワードの入力だけでなく、確認用パスワードやユーザー名なども必要になる可能性があります。
export const SignUpInputDtoSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
  confirmPassword: v.string(),
});

export type SignUpInputDto = v.InferOutput<typeof SignUpInputDtoSchema>;

/**
 * パスワードリセットリクエスト用のDTO
 * emailアドレスを受け取り、リセット用のメールを送信する
 */
export const resetPasswordRequestInputDtoSchema = v.object({
  email: v.pipe(
    v.string("メールアドレスを入力してください"),
    v.email("有効なメールアドレスを入力してください"),
  ),
});

export type ResetPasswordRequestInputDto = v.InferOutput<
  typeof resetPasswordRequestInputDtoSchema
>;

/**
 * パスワードリセット用のDTO
 * パスワードと確認用パスワードを受け取る
 */
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

export const switchTenantRequestSchema = v.object({
  tenantId: v.pipe(v.string(), v.minLength(1)),
});

export type SwitchTenantRequest = v.InferOutput<
  typeof switchTenantRequestSchema
>;
