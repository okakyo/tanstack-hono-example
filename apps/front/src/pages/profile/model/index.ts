import * as v from "valibot";

const EMAIL_INVALID_MESSAGE = "有効なメールアドレスを入力してください。";
const NAME_REQUIRED_MESSAGE = "名前を入力してください。";

/**
 * プロフィールページのテナント情報のスキーマ
 */
export const tenantInfoSchema = v.object({
  /** テナントID */
  tenantId: v.string(),
  /** テナント名 */
  tenantName: v.string(),
  /** 会社名 */
  companyName: v.string(),
  /** メンバーロール */
  memberRole: v.string(),
});

/**
 * 現在選択中のテナント情報のスキーマ
 */
export const currentTenantInfoSchema = v.object({
  tenantId: v.nullable(v.string()),
  tenantName: v.nullable(v.string()),
  companyName: v.nullable(v.string()),
  memberRole: v.nullable(v.string()),
});

/**
 * プロフィールページのユーザー情報のスキーマ
 */
export const profileDataSchema = v.object({
  /** ユーザーID */
  id: v.string(),
  /** ユーザー名 */
  name: v.string(),
  /** メールアドレス */
  email: v.string(),
});

/**
 * プロフィール更新フォームのスキーマ
 */
export const profileFormSchema = v.object({
  /** ユーザーID */
  id: v.string(),
  /** ユーザー名 */
  name: v.pipe(v.string(), v.minLength(1, NAME_REQUIRED_MESSAGE)),
  /** メールアドレス */
  email: v.pipe(v.string(), v.email(EMAIL_INVALID_MESSAGE)),
});

export type TenantInfo = v.InferOutput<typeof tenantInfoSchema>;
export type CurrentTenantInfo = v.InferOutput<typeof currentTenantInfoSchema>;
export type ProfileData = v.InferOutput<typeof profileDataSchema>;
export type ProfileFormData = v.InferOutput<typeof profileFormSchema>;

/**
 * プロフィールページのUIコンポーネントに渡すPropsの型定義
 */
export type ProfilePageUiProps = {
  /** プロフィールデータ */
  profileData: ProfileData | null;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: Error | null;
  /** 現在の所属テナント情報 */
  currentTenant: CurrentTenantInfo;
  /** 現在の所属以外のテナント一覧 */
  selectableTenants: TenantInfo[];
  /** フォームデータ */
  formData: ProfileFormData;
  /** フォームデータを更新する関数 */
  setFormData: (data: ProfileFormData) => void;
  /** プロフィール情報を更新する関数 */
  onSubmit: (e: React.FormEvent) => Promise<void>;
  /** 更新処理実行中かどうか */
  isUpdating: boolean;
  /** 更新成功フラグ */
  isSuccess: boolean;
};
