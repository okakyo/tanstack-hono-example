import type { AuthContextValue } from "../provider/auth/type";

/**
 * ルートコンテキストの型定義
 * 各ルートで共有されるコンテキスト情報を定義します
 * 現在は認証情報を中心に構成されていますが、将来的には他のグローバルな状態も追加可能です
 */
export type RootContext = AuthContextValue;

/**
 * ルートコンテキストの初期値
 * 型安全性を確保するため、satisfies演算子を使用しています
 */
export const initialRootContext = {
  isLoading: true,
  user: null,
  accessToken: null,
  currentTenantId: null,
  currentCompanyId: null,
  selectableTenants: [],
} as const satisfies RootContext;
