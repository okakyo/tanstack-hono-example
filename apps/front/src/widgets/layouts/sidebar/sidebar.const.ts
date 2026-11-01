import type React from "react";
import { FaHome } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export type SidebarItem = {
  title: string;
  icon: React.ElementType;
  to: string;
};

export const COMMON_SIDEBAR_LIST = [
  {
    title: "ホーム",
    icon: FaHome,
    to: "/",
  },
  {
    title: "設定",
    icon: FaGear,
    to: "/settings/companies",
  }
];

export const ADMIN_SIDEBAR_LIST = [
  {
    title: "ホーム",
    icon: FaHome,
    to: "/",
  },
  {
    title: "設定",
    icon: FaGear,
    to: "/settings/companies",
  },
];

export const ADMIN_SETTING_SIDEBAR_LIST = [
  {
    title: "企業",
    icon: FaGear,
    to: "/settings/companies",
  },
  {
    title: "メンバー",
    icon: FaGear,
    to: "/settings/members",
  },
  {
    title: "ロール",
    icon: FaGear,
    to: "/settings/roles",
  },
];
