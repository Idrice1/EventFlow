import { describe, expect, it } from "vitest";

import { createEventSchema, eventSchema } from "./events";
import { getPublicEvent } from "./public-event";

describe("createEventSchema", () => {
  it("trims text and coerces a positive integer capacity", () => {
    expect(
      createEventSchema.parse({
        name: "  Afterglow  ",
        date: "2026-12-05",
        venue: " Pier 27 ",
        capacity: "250",
      }),
    ).toEqual({
      name: "Afterglow",
      date: "2026-12-05",
      venue: "Pier 27",
      capacity: 250,
    });
  });

  it.each(["", "0", "-2", "2.5", "not-a-number"])(
    "rejects an invalid capacity: %s",
    (capacity) => {
      expect(
        createEventSchema.safeParse({
          name: "Afterglow",
          date: "2026-12-05",
          venue: "Pier 27",
          capacity,
        }).success,
      ).toBe(false);
    },
  );

  it("rejects missing event details", () => {
    expect(
      createEventSchema.safeParse({
        name: " ",
        date: "",
        venue: " ",
        capacity: 25,
      }).success,
    ).toBe(false);
  });
});

describe("eventSchema", () => {
  it("rejects corrupt saved event records", () => {
    expect(
      eventSchema.safeParse({
        id: "not-an-id",
        name: "Afterglow",
        date: "2026-12-05",
        venue: "Pier 27",
        sold: 0,
        capacity: 250,
        revenue: 0,
        status: "Live",
        art: "event-art--afterglow",
        initials: "AF",
      }).success,
    ).toBe(false);
  });
});

describe("getPublicEvent", () => {
  it("returns a public event by slug", () => {
    expect(getPublicEvent("afterglow-festival")).toMatchObject({
      title: "Afterglow Festival",
    });
  });

  it("does not substitute an unrelated event for an unknown slug", () => {
    expect(getPublicEvent("unknown-event")).toBeUndefined();
  });
});
