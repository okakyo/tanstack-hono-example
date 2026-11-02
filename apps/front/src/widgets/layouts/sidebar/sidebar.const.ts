import type React from "react";
import { FaHome } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { isAdminRole } from "@/shareds/provider/auth/authorization";

export type SidebarItem = {
  title: string;
  icon: React.ElementType;
  to: string;
  adminOnly?: boolean;
};

const SETTINGS_ROOT_PATHS = [
  "/settings/companies",
  "/settings/members",
  "/settings/roles",
] as const;

export const COMMON_SIDEBAR_LIST: SidebarItem[] = [
  {
    title: "ホーム",
    icon: FaHome,
    to: "/",
  },
  {
    title: "設定",
    icon: FaGear,
    to: "/settings/companies",
    adminOnly: true,
  },
];

export const ADMIN_SETTING_SIDEBAR_LIST: SidebarItem[] = [
  {
    title: "企業",
    icon: FaGear,
    to: "/settings/companies",
    adminOnly: true,
  },
  {
    title: "メンバー",
    icon: FaGear,
    to: "/settings/members",
    adminOnly: true,
  },
  {
    title: "ロール",
    icon: FaGear,
    to: "/settings/roles",
    adminOnly: true,
  },
];

export const isSettingsSidebarRoute = (
  matchRoute: (options: { to: string; fuzzy?: boolean }) => unknown,
) => {
  return SETTINGS_ROOT_PATHS.some((to) => Boolean(matchRoute({ to, fuzzy: true })));
};

export const getSidebarItems = (
  role: string | null | undefined,
  isSettingsRoute: boolean,
) => {
  const items = isSettingsRoute
    ? ADMIN_SETTING_SIDEBAR_LIST
    : COMMON_SIDEBAR_LIST;

  return items.filter((item) => !item.adminOnly || isAdminRole(role));
};
