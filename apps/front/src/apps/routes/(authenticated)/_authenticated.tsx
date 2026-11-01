/**
 * 認証が必要なルートのレイアウトコンポーネント
 *
 * このコンポーネントは、認証が必要なすべてのページの親となります。
 * ログインしていないユーザーは自動的にログインページにリダイレクトされます。
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuthenticatedSession } from "@/shareds/provider/auth/authQuery";
import { TheLayout } from "@/widgets/layouts";

/**
 * 認証状態をチェックし、未ログインの場合はログインページにリダイレクト
 *
 */
export const Route = createFileRoute("/(authenticated)/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    await requireAuthenticatedSession();
  },
});

/**
 * 認証済みルートのレイアウトコンポーネント
 *
 * 子ルートの内容をここに表示します
 */
function RouteComponent() {
  return (
    <TheLayout>
      {/* 子ルートのコンテンツを表示 */}
      <Outlet />
    </TheLayout>
  );
}
