import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { LoginInputDto } from "../api/schema";

/**
 * サインインページのプロパティ
 *
 * UIコンポーネントに渡される状態とハンドラーを定義します。
 */
export type SignInPageProps = {
  /** Server からログインの可否についてのエラーメッセージの表示 */
  serverError: string | null;
  /** React Hook Form の useForm 関数 */
  handleForm: UseFormReturn<LoginInputDto, unknown, LoginInputDto>;
  /** ログイン処理中かどうか */
  isLoading: boolean;

  /** フォーム登録関数 */
  onSubmit: SubmitHandler<LoginInputDto>;

  /** サインアップページへのナビゲーション関数 */
  navigateToSignup: () => void;
};

/**
 * 検索パラメータの型定義
 * ログイン後にリダイレクトする URL を保持
 */
export type SignInSearch = {
  redirect?: string;
};
