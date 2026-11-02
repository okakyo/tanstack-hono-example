import { describe, expect, it } from "vitest";
import {
  getSidebarItems,
  isSettingsSidebarRoute,
} from "./sidebar.const";

describe("sidebar.const", () => {
  it("detects settings routes from the route matcher", () => {
    const matchRoute = ({ to }: { to: string; fuzzy?: boolean }) => {
      return [
        "/settings/companies",
        "/settings/members",
        "/settings/roles",
      ].includes(to);
    };

    expect(isSettingsSidebarRoute(matchRoute)).toBe(true);
  });

  it("hides admin-only items for guest users", () => {
    const items = getSidebarItems("guest", false);

    expect(items.map((item) => item.to)).toEqual(["/"]);
  });

  it("shows settings item for admin users on the top level sidebar", () => {
    const items = getSidebarItems("admin", false);

    expect(items.map((item) => item.to)).toEqual(["/", "/settings/companies"]);
  });
});
