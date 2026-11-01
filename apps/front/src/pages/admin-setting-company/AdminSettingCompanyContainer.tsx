import { useAdminSettingCompanyPageHooks } from "./api/useAdminSettingCompanyPageHooks";
import { AdminSettingCompanyPageUi } from "./ui/AdminSettingCompanyPageUi";

export const AdminSettingCompanyPage = () => {
  const props = useAdminSettingCompanyPageHooks();
  return <AdminSettingCompanyPageUi {...props} />;
};
