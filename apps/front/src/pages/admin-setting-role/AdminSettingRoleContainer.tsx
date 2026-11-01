import { useAdminSettingRolePageHooks } from "./api";
import { AdminSettingRolePageUi } from "./ui/AdminSettingRolePageUi";

export const AdminSettingRolePage = () => {
  const props = useAdminSettingRolePageHooks();

  return <AdminSettingRolePageUi {...props} />;
};
