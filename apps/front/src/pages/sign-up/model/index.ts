import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { SignUpInputDto } from "../api/schema";

/**
 * サインアップページのプロパティ
 *
 * UIコンポーネントに渡される状態とハンドラーを定義します。
 */
export type SignUpPageProps = {
  /** Server からログインの可否についてのエラーメッセージの表示 */
  serverError: string | null;
  /** React Hook Form の useForm 関数 */
  handleForm: UseFormReturn<SignUpInputDto, unknown, SignUpInputDto>;
  /** ログイン処理中かどうか */
  isLoading: boolean;

  /** フォーム登録関数 */
  onSubmit: SubmitHandler<SignUpInputDto>;
  /** サインアップページへのナビゲーション関数 */
  navigateToSignin: () => void;
};
