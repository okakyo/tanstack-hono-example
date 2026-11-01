import { createFileRoute } from "@tanstack/react-router";
import { PasswordResetPage } from "@/pages/password-reset";

/**
 * パスワードリセットページのルート定義
 *
 * URLのcodeパラメータはページコンポーネント内で検証されます
 */
export const Route = createFileRoute("/(auth)/password-reset")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      code: (search.code as string) || undefined,
    };
  },
});

function RouteComponent() {
  return <PasswordResetPage />;
}
