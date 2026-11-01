import { useProfilePageHooks } from "./api";
import { ProfilePageUi } from "./ui";

/**
 * プロフィールページのメインコンポーネント
 * ログインユーザーのプロフィール情報を表示します
 */
export const ProfilePage = () => {
  const props = useProfilePageHooks();
  return <ProfilePageUi {...props} />;
};
