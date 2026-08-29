import { describe, expect, it } from "vitest";
import { canAccessContent, isContentLockedFor } from "@/lib/access";

const LEVELS = [1, 2, 3, 4] as const;

/**
 * Tests for the access predicate that the get_content_item RPC and
 * educational_content tier policy enforce (migrations 0012 + 0013).
 *
 * SQL gate summary:
 *   - Anonymous (null): can read level-4 items only (public-open per 0013).
 *   - Approved users (access_level N): can read items with access_level >= N.
 *   - Pending users: same as anonymous — only level-4 open.
 */

describe("canAccessContent", () => {
  it("an approved Owner (1) can read every tier", () => {
    for (const required of LEVELS) {
      expect(canAccessContent(1, required, true)).toBe(true);
    }
  });

  it("a Member (2) can read tiers 2, 3, 4 but not 1", () => {
    expect(canAccessContent(2, 1, true)).toBe(false);
    for (const req of [2, 3, 4] as const) expect(canAccessContent(2, req, true)).toBe(true);
  });

  it("a Co-member (3) can read tiers 3, 4 but not 1 or 2", () => {
    expect(canAccessContent(3, 1, true)).toBe(false);
    expect(canAccessContent(3, 2, true)).toBe(false);
    expect(canAccessContent(3, 3, true)).toBe(true);
    expect(canAccessContent(3, 4, true)).toBe(true);
  });

  it("a Public (4) user can read ONLY tier 4", () => {
    expect(canAccessContent(4, 4, true)).toBe(true);
    for (const req of [1, 2, 3] as const) expect(canAccessContent(4, req, true)).toBe(false);
  });

  it("anonymous (null) can read tier-4 (Public) items — per 0013 public-open gate", () => {
    expect(canAccessContent(null, 4)).toBe(true);
  });

  it("anonymous (null) cannot read tier 1, 2 or 3 — fail closed for locked tiers", () => {
    for (const required of [1, 2, 3] as const) {
      expect(canAccessContent(null, required)).toBe(false);
    }
  });

  it("pending users behave like anonymous — only tier 4 open", () => {
    expect(canAccessContent(4, 4, false)).toBe(true);
    for (const req of [1, 2, 3] as const) expect(canAccessContent(4, req, false)).toBe(false);
  });

  it("approved predicate: required >= user for every pair", () => {
    for (const userLevel of [1, 2, 3, 4] as const) {
      for (const required of LEVELS) {
        expect(canAccessContent(userLevel, required, true)).toBe(required >= userLevel);
      }
    }
  });
});

describe("isContentLockedFor", () => {
  it("locked exactly when not accessible", () => {
    for (const userLevel of [1, 2, 3, 4, null] as const) {
      for (const required of LEVELS) {
        expect(isContentLockedFor(userLevel, required)).toBe(
          !canAccessContent(userLevel, required)
        );
      }
    }
  });

  it("anonymous sees only level-4 as open", () => {
    expect(isContentLockedFor(null, 1)).toBe(true);
    expect(isContentLockedFor(null, 2)).toBe(true);
    expect(isContentLockedFor(null, 3)).toBe(true);
    expect(isContentLockedFor(null, 4)).toBe(false);
  });

  it("Public (4) sees tier 1-3 as locked, tier 4 open", () => {
    expect(isContentLockedFor(4, 1)).toBe(true);
    expect(isContentLockedFor(4, 2)).toBe(true);
    expect(isContentLockedFor(4, 3)).toBe(true);
    expect(isContentLockedFor(4, 4)).toBe(false);
  });

  it("Owner (1) sees nothing locked", () => {
    for (const required of LEVELS) expect(isContentLockedFor(1, required)).toBe(false);
  });
});
