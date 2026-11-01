import { useAdminSettingMemberPageHooks } from "./api/useAdminSettingMemberHooks";
import { AdminSettingMemberPageUi } from "./ui/AdminSettingMember";

export const AdminSettingMemberPage = () => {
  const props = useAdminSettingMemberPageHooks();
  return <AdminSettingMemberPageUi {...props} />;
};
