# AGENT STATUS

Last updated: 2026-08-29 (NEB Grade 11 syllabus seeded: Physics, Chemistry, Biology)

### Status: Syllabus seeded — 53 chapters across 3 subjects, content under development

### Tasks (this session)
| Task | Status |
| --- | --- |
| BackButton: arrow-in-box only, no text label | Done |
| CSS: back button removed from fixed position, clean box style | Done |
| All page usages updated (label prop removed) | Done |
| `.under-development` CSS class added (dashed border, muted) | Done |
| All empty/placeholder states replaced with "Under development — will be added in future update" | Done |
| `npm run lint` + `npx tsc --noEmit` green | Done |
| Git commit + push | Done |
| NEB Grade 11 syllabus seeding (Physics/Chemistry/Biology) | Done |

### Syllabus migration
- Created `scripts/migrate-syllabus.mjs` — seeds exam group → subjects → chapters (units) → sub-chapters → topics → placeholder content items
- Ran against live Supabase: **3 subjects, 53 chapters, 53 sub-chapters, 53 topics, 53 content items**
- `npm run migrate:syllabus` to re-run (idempotent via upserts)
- Units seeded:
  - **Physics**: 26 units (Physical Quantities → Recent Trends in Physics)
  - **Chemistry**: 17 units (Foundation → Modern Chemical Manufactures)
  - **Biology**: 10 units (Biomolecules → Conservation Biology)

### Run commands
- `npm run migrate:syllabus` — seed NEB Grade 11 syllabus
- `npm run migrate:content` — full content migration (all 4 source dirs)
- `npm run migrate:contents` — subject-grouped migration (excludes migrated-content)
- `npm run verify:migration` — cross-exam-group count check

### History
- (2026-08-29) BACK BUTTON + UNDER-DEVELOPMENT STATE. Removed text label from BackButton (arrow-in-box only), changed from fixed floating button to inline below-header placement. Added `.under-development` CSS class (dashed border, placeholder styling). Replaced all empty/placeholder states across 8+ pages with "Under development — will be added in future update". Also fixed `.gitignore` (aider files) and added Instagram link to footer. tsc + lint clean.
- (2026-08-29) NEB SYLLABUS SEED. Created `scripts/migrate-syllabus.mjs` and seeded all three NEB Grade 11 science subjects (Physics 26 units, Chemistry 17 units, Biology 10 units) into the live Supabase DB. Each unit becomes a chapter with a placeholder topic and content item. Re-run safe via idempotent upserts.
- (2026-08-16) APP SIDE OF THE AUTH/APPROVAL BUILD. DB side was already done (migrations 0012 approval flow + tier spread 10/25/50/100, 0013 public-open fix). Added auth API routes (signin/signup/signout), owner-only admin users API, `/login`, `/admin` (member management: approve/hold/reject + tier select), `/info` (rules & notices with tier percentages and official notices), rebuilt `SiteHeader` with real sessions (sign-in pill, profile dropdown with tier label, owner-only admin link, working sign out, `/info` nav link), owner-email line in `LockedSection`, and the missing `.btn`/`.btn-primary`/`.btn-secondary` base styles. tsc + lint clean, Vitest 23/23.
- (2026-08-15) CLASS 11 NOTES IMPORT. Extended `scripts/migrate-content.mjs` to seed all six NEB subjects under `class-11`, load `.env.local`, map `class-11` + `class-11e` source folders into the Class 11 Notes exam group. Ran migration: 6 subjects (english/nepali empty placeholders), 10 chapters, 134 topics + content items. Added `scripts/verify-class-11.mjs`.
- (2026-08-15) HOME RESTRUCTURE. Replaced the old multi-section home with NatureInspiration + HomeDashboard (Class 11 Notes/11E/More, Class 12 Notes/12E/More → six subjects each; Knowledge → Loksewa + World Knowledge). Header brand + search + yellow upgrade. Floating AI chat with platform scope. Footer rewritten. Build green.
