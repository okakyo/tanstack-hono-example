
/**
 * アカウント一覧に追加するシードデータ
 * @description アカウント一覧に追加するシードデータの例を示します。
 * - authUserId: 認証ユーザーID(UUID)
 * - name: 名前
 * - email: メールアドレス
 * 
 * @example
 * {
 *   authUserId: "*******-****-****-****-*******",
 *   name: "山田 太郎",
 *   email: "test@example.com",
 * }
 * 
 */

type AccountSeed = {
	authUserId: string;
	name: string;
	email: string;
};

export const AccountListSeed: AccountSeed[] = [];
