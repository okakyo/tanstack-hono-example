import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { ResetPasswordRequestInputDto } from "../api/schema";

/**
 * パスワードリセットリクエストページのプロパティ定義
 */
export type PasswordResetRequestPageProps = {
  /** React Hook Form のフォーム管理オブジェクト */
  handleForm: UseFormReturn<ResetPasswordRequestInputDto>;
  /** サーバーエラーメッセージ */
  serverError: string | null;
  /** 成功メッセージ */
  successMessage: string | null;
  /** フォーム送信ハンドラ */
  onSubmit: SubmitHandler<ResetPasswordRequestInputDto>;
  /** サインインページへのナビゲーション */
  navigateToSignIn: () => void;
  /** ローディング状態 */
  isLoading: boolean;
};
