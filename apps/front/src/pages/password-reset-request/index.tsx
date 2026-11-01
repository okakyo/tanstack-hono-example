import { usePasswordResetRequestPageHooks } from "./api";
import { PasswordResetRequestPageUi } from "./ui";

/**
 * パスワードリセットリクエストページ
 *
 * メールアドレスを入力してパスワードリセット用のメールを送信するページです。
 */
export const PasswordResetRequestPage = () => {
  const props = usePasswordResetRequestPageHooks();
  return <PasswordResetRequestPageUi {...props} />;
};
