import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { paginate } from "./utils.ts";

describe("paginate", () => {
  it("returns empty value on empty array", () => {
    expect(paginate([], { page: 1, pageSize: 5 })).toBeNull();
  });
  it("returns proper values for pages", () => {
    expect(paginate([1, 2, 3, 4, 5], { page: 1, pageSize: 3 })).toEqual({
        items: [1, 2, 3],
        totalPages: 2,
      });
    expect(paginate([1, 2, 3, 4, 5], { page: 2, pageSize: 3 })).toEqual({
      items: [4, 5],
      totalPages: 2,
    });
  });
  it("returns empty value on incorrent input", () => {
    expect(paginate([], { page: 1, pageSize: -1 })).toBeNull();
    expect(paginate([1,3], { page: 2, pageSize: 3 })).toBeNull();
  });
});
