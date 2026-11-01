import { HTTPException } from "hono/http-exception";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockInviteStatusRepository } from "../../../../libs/mocks/mockRepositories";
import { findInviteStatusesUseCase } from "./find-invite-statuses.usecase";

describe("findInviteStatusesUseCase", () => {
  const useCase = findInviteStatusesUseCase(mockInviteStatusRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("招待状態一覧を正常に取得できる", async () => {
    mockInviteStatusRepository.find.mockResolvedValue([
      {
        id: "00000000-0000-0000-0000-000000000101",
        code: "pending",
        name: "招待中",
        description: "招待メール送信済み",
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
        createdBy: "00000000-0000-0000-0000-000000000000",
        updatedBy: "00000000-0000-0000-0000-000000000000",
      },
      {
        id: "00000000-0000-0000-0000-000000000102",
        code: "joined",
        name: "参加済み",
        description: null,
        createdAt: new Date("2024-01-02T00:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-02T00:00:00Z").toISOString(),
        createdBy: "00000000-0000-0000-0000-000000000000",
        updatedBy: "00000000-0000-0000-0000-000000000000",
      },
    ]);

    const result = await useCase();

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual([
      {
        id: "00000000-0000-0000-0000-000000000101",
        code: "pending",
        name: "招待中",
        description: "招待メール送信済み",
      },
      {
        id: "00000000-0000-0000-0000-000000000102",
        code: "joined",
        name: "参加済み",
        description: null,
      },
    ]);
  });

  it("リポジトリエラーをそのまま返す", async () => {
    const repositoryError = new HTTPException(500, {
      message: "Database connection failed",
    });

    mockInviteStatusRepository.find.mockRejectedValue(repositoryError);

    const result = await useCase();

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toStrictEqual(repositoryError);
  });
});
