import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

import createCalendar from "./createCalendar.ts";

describe("createCalendar", () => {
  it("should generate October, 2024", () => {
    expect(createCalendar({ month: 9, year: 2024 })).toEqual([
      [null, null, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, null, null],
    ]);
  });
  it("should generate February, 2024", () => {
    expect(createCalendar({ month: 1, year: 2024 })).toEqual([
      [null, null, null, null, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, null, null],
    ]);
  });
  it("should generate February, 2025", () => {
    expect(createCalendar({ month: 1, year: 2025 })).toEqual([
      [null, null, null, null, null, null, 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, null],
    ]);
  });
  it("should generate January, 1970", () => {
    expect(createCalendar({ month: 0, year: 1970 })).toEqual([
      [null, null, null, null, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, 30, 31],
    ]);
  });
  it("should generate April, 2014", () => {
    expect(createCalendar({ month: 3, year: 2014 })).toEqual([
      [null, null, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, null, null, null],
    ]);
  });
  it("should generate October, 2000", () => {
    expect(createCalendar({ month: 9, year: 2000 })).toEqual([
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 31, null, null, null, null],
    ]);
  });
  it.skip("should generate proper calendars 1970-2100", () => {
    for (let year = 1970; year <= 2100; year++) {
      for (let month = 0; month < 12; month++) {
        const days = createCalendar({ month, year });
        days.forEach((row) => {
          row.forEach((day, weekDay) => {
            if (!day) return;
            const date = new Date(year, month, day);
            expect(date.getDay()).toBe(weekDay);
          });
        });
      }
    }
  });
});
