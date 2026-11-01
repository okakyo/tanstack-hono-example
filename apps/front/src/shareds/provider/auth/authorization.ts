const ADMIN_ROLES = new Set(["admin", "管理者"]);
const GUEST_ROLES = new Set(["guest", "ゲスト"]);

/** 設定を変更できるロールかどうかを判定します。 */
export const isAdminRole = (role: string | null | undefined) => {
  return role != null && ADMIN_ROLES.has(role.trim().toLowerCase());
};

/** ロールが未割当、または guest のユーザーかどうかを判定します。 */
export const isGuestRole = (role: string | null | undefined) => {
  return (
    role == null ||
    role.trim() === "" ||
    GUEST_ROLES.has(role.trim().toLowerCase())
  );
};
