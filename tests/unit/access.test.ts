import { describe, expect, it } from "vitest";
import { canAccessContent, isContentLockedFor, validateAccessLevel } from "@/lib/access";
import { ACCESS_LEVEL_LABELS, maskedTitle } from "@/lib/types";
import type { AccessLevel } from "@/lib/types";

const LEVELS = [1, 2, 3, 4] as const;

describe("canAccessContent", () => {
  it("Owner (1) can read every tier (1, 2, 3, 4) when approved", () => {
    for (const required of LEVELS) {
      expect(canAccessContent(1, required, true)).toBe(true);
    }
  });

  it("Member (2) can read tiers 2, 3, 4 but NOT Owner-only (1)", () => {
    expect(canAccessContent(2, 1, true)).toBe(false);
    for (const required of [2, 3, 4] as const) {
      expect(canAccessContent(2, required, true)).toBe(true);
    }
  });

  it("Co-member (3) can read tiers 3, 4 but NOT 1 or 2", () => {
    expect(canAccessContent(3, 1, true)).toBe(false);
    expect(canAccessContent(3, 2, true)).toBe(false);
    expect(canAccessContent(3, 3, true)).toBe(true);
    expect(canAccessContent(3, 4, true)).toBe(true);
  });

  it("Public (4) can read ONLY free content (tier 4)", () => {
    expect(canAccessContent(4, 4, true)).toBe(true);
  });

  it("REQUIREMENT: Public (4) CANNOT read raw Level 1, 2 or 3 content", () => {
    expect(canAccessContent(4, 1, true)).toBe(false);
    expect(canAccessContent(4, 2, true)).toBe(false);
    expect(canAccessContent(4, 3, true)).toBe(false);
  });

  it("anonymous (null) CAN read Public (4) items per 0013 SQL gate", () => {
    expect(canAccessContent(null, 4)).toBe(true);
  });

  it("anonymous (null) CANNOT read Level 1, 2 or 3 content", () => {
    for (const required of [1, 2, 3] as const) {
      expect(canAccessContent(null, required)).toBe(false);
    }
  });

  it("pending users behave like anonymous — only Public (4) open", () => {
    for (const required of [1, 2, 3] as const) {
      expect(canAccessContent(4, required, false)).toBe(false);
    }
    expect(canAccessContent(4, 4, false)).toBe(true);
  });

  it("matches the RLS predicate exactly: required >= user for every approved pair", () => {
    for (const userLevel of [1, 2, 3, 4] as const) {
      for (const required of LEVELS) {
        expect(canAccessContent(userLevel, required, true)).toBe(required >= userLevel);
      }
    }
  });
});

describe("isContentLockedFor", () => {
  it("is locked exactly when the content is not accessible", () => {
    for (const userLevel of [1, 2, 3, 4, null] as const) {
      for (const required of LEVELS) {
        expect(isContentLockedFor(userLevel, required)).toBe(
          !canAccessContent(userLevel, required)
        );
      }
    }
  });

  it("anonymous users see only level-4 items as open", () => {
    expect(isContentLockedFor(null, 1)).toBe(true);
    expect(isContentLockedFor(null, 2)).toBe(true);
    expect(isContentLockedFor(null, 3)).toBe(true);
    expect(isContentLockedFor(null, 4)).toBe(false);
  });

  it("Public (4) sees tier 1-3 items as locked but tier 4 as open", () => {
    expect(isContentLockedFor(4, 1)).toBe(true);
    expect(isContentLockedFor(4, 2)).toBe(true);
    expect(isContentLockedFor(4, 3)).toBe(true);
    expect(isContentLockedFor(4, 4)).toBe(false);
  });

  it("Owner (1) sees nothing as locked", () => {
    for (const required of LEVELS) {
      expect(isContentLockedFor(1, required)).toBe(false);
    }
  });
});

describe("validateAccessLevel", () => {
  it("accepts exactly the integers 1 through 4", () => {
    expect(validateAccessLevel(1)).toBe(true);
    expect(validateAccessLevel(2)).toBe(true);
    expect(validateAccessLevel(3)).toBe(true);
    expect(validateAccessLevel(4)).toBe(true);
  });

  it("rejects out-of-range, non-integer and non-numeric values", () => {
    expect(validateAccessLevel(0)).toBe(false);
    expect(validateAccessLevel(5)).toBe(false);
    expect(validateAccessLevel(-1)).toBe(false);
    expect(validateAccessLevel(2.5)).toBe(false);
    expect(validateAccessLevel("2")).toBe(false);
    expect(validateAccessLevel(null)).toBe(false);
    expect(validateAccessLevel(undefined)).toBe(false);
    expect(validateAccessLevel(NaN)).toBe(false);
  });
});

describe("API lock metadata helpers", () => {
  it("every tier has a human-readable label", () => {
    const levels: AccessLevel[] = [1, 2, 3, 4];
    for (const level of levels) {
      expect(ACCESS_LEVEL_LABELS[level]).toBeTruthy();
    }
    expect(ACCESS_LEVEL_LABELS[1]).toBe("Owner");
    expect(ACCESS_LEVEL_LABELS[2]).toBe("Member");
    expect(ACCESS_LEVEL_LABELS[3]).toBe("Co-member");
    expect(ACCESS_LEVEL_LABELS[4]).toBe("Public");
  });

  it("masked titles carry the tier requirement (no raw title leak)", () => {
    expect(maskedTitle(1)).toContain("Owner");
    expect(maskedTitle(2)).toContain("Member");
    expect(maskedTitle(3)).toContain("Co-member");
    expect(maskedTitle(4)).toContain("Public");
  });
});
