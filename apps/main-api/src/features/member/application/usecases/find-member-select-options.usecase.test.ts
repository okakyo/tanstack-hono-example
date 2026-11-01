import { describe, expect, it, vi } from "vitest";
import { findMemberSelectOptionsUsecase } from "./find-member-select-options.usecase";

describe("find-member-select-options.usecase", () => {
  it("tenantId に紐づく id/name の一覧を返す", async () => {
    const repository = {
      memberRepository: {
        findSelectOptionsByTenantId: vi.fn().mockResolvedValue([
          { id: "member-1", name: "田中 太郎" },
          { id: "member-2", name: "佐藤 花子" },
        ]),
      },
    } as unknown as Parameters<typeof findMemberSelectOptionsUsecase>[1];

    const result = await findMemberSelectOptionsUsecase(
      { tenantId: "tenant-1" },
      repository,
    );

    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      return;
    }

    expect(result.value).toEqual([
      { id: "member-1", name: "田中 太郎" },
      { id: "member-2", name: "佐藤 花子" },
    ]);
  });
});
