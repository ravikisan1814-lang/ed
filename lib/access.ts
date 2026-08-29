import type { AccessLevel } from "@/lib/types";

/**
 * Access-control helpers — the TypeScript mirror of the PostgreSQL RLS
 * predicates defined in migrations 0003 + 0012 + 0013.
 *
 * SQL gate (0013) summary:
 *   - Anonymous (no profile): can read level-4 (Public) items only.
 *   - Approved users: read items where access_level <= their tier.
 *   - Pending users: same as anonymous (fail-closed for tiers 1-3).
 *
 * These are the single source of truth for API-layer lock decisions and
 * are covered by unit tests in tests/unit/access.test.ts.
 */

export function canAccessContent(
  userAccessLevel: AccessLevel | null,
  requiredAccessLevel: AccessLevel,
  approved: boolean = true
): boolean {
  // Anonymous users: can only read Public (level 4) items per 0013 SQL gate
  if (userAccessLevel === null) return requiredAccessLevel === 4;
  // Pending users treated as anonymous (approval gate — 0012/0013)
  if (!approved) return requiredAccessLevel === 4;
  return requiredAccessLevel >= userAccessLevel;
}

export function isContentLockedFor(
  userAccessLevel: AccessLevel | null,
  requiredAccessLevel: AccessLevel,
  approved: boolean = true
): boolean {
  return !canAccessContent(userAccessLevel, requiredAccessLevel, approved);
}

/** Accepts exactly the integers 1..4. */
export function validateAccessLevel(value: unknown): value is AccessLevel {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 4
  );
}
