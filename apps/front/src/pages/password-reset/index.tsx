import { usePasswordResetPageHooks } from "./api";
import { PasswordResetPageUi } from "./ui";

/**
 * パスワードリセットページ
 *
 * リセットメールのリンクから遷移し、新しいパスワードを設定するページです。
 */
export const PasswordResetPage = () => {
  const props = usePasswordResetPageHooks();
  return <PasswordResetPageUi {...props} />;
};
