import { describe, expect, it } from "vitest";
import {
  buildTableSearchParams,
  mergeTableSearchParams,
  parseTableSearchParams,
} from "./useControl";

describe("admin setting table search params", () => {
  it("converts search params from the URL into query state", () => {
    expect(
      parseTableSearchParams("?q=Alice&page=2&sortBy=name&order=desc"),
    ).toEqual({
      searchText: "Alice",
      page: 2,
      sortBy: {
        field: "name",
        order: "desc",
      },
    });
  });

  it("keeps the URL search params in sync with the table state", () => {
    expect(
      buildTableSearchParams({
        searchText: "Alice",
        page: 2,
        sortBy: {
          field: "name",
          order: "desc",
        },
      }),
    ).toEqual({
      q: "Alice",
      page: 2,
      sortBy: "name",
      order: "desc",
    });
  });

  it("removes stale search params when the input is cleared", () => {
    expect(
      mergeTableSearchParams(
        {
          q: "Alice",
          page: "2",
          sortBy: "name",
          order: "desc",
          foo: "bar",
        },
        {
          searchText: "",
          page: 1,
          sortBy: {
            field: "updatedAt",
            order: "desc",
          },
        },
        { field: "updatedAt", order: "desc" },
      ),
    ).toEqual({
      foo: "bar",
    });
  });
});
