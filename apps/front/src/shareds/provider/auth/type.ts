export type CurrentUser = {
  id: string;
  name: string;
  currentTenantName: string | null;
  currentCompanyId: string | null;
  companyName: string | null;
  role: string | null;
};

export type AuthSession = {
  /** 認証ユーザー情報 */
  user: CurrentUser | null;
  /** アクセストークン */
  accessToken: string | null;
  /** 現在選択されているテナントID */
  currentTenantId: string | null;
  /** 現在選択されている会社ID */
  currentCompanyId: string | null;
  /** 選択可能なテナント一覧 */
  selectableTenants: {
    tenantId: string;
    companyId: string;
    companyName: string;
    memberRole: string;
  }[];
};

export type AuthContextValue = {
  /** 認証状態のローディング状態 */
  isLoading: boolean;
} & AuthSession;
