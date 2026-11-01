import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { ResetPasswordInputDto } from "../api/schema";

/**
 * パスワードリセットページのプロパティ定義
 */
export type PasswordResetPageProps = {
  /** React Hook Form のフォーム管理オブジェクト */
  handleForm: UseFormReturn<ResetPasswordInputDto>;
  /** サーバーエラーメッセージ */
  serverError: string | null;
  /** 成功メッセージ */
  successMessage: string | null;
  /** フォーム送信ハンドラ */
  onSubmit: SubmitHandler<ResetPasswordInputDto>;
  /** サインインページへのナビゲーション */
  navigateToSignIn: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** コード検証中かどうか */
  isVerifying: boolean;
  /** コード検証エラー */
  verifyError: string | null;
};
