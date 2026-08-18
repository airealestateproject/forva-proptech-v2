# FORVA PropTech V2 redesign

This package unifies the public marketing site, authentication experience, onboarding, and client application under one FORVA PropTech visual system.

## V2 changes
- Preserves canonical `forva-logo-master.png` and `forva-app-icon-master.png` assets.
- Includes all nine approved FORVA feature/reference visuals in `public/`.
- Rebuilds the authenticated application shell with premium navy navigation, bright workspace, global search, mobile drawer/navigation, and consistent controls.
- Rebuilds the client Overview dashboard around lead KPIs, pipeline stages, FORVA Intelligence, activity, source performance, and follow-up queue.
- Rebuilds authentication into a responsive split experience consistent with the website and client dashboard.
- Applies the V2 light product design system to Leads, Lead Details, Conversations, Appointments, Analytics, Team, Notifications, Settings, and onboarding while preserving their existing route/data/auth behavior.
- Keeps the approved Solo $49 / Team $129 / Agency $249 monthly pricing and 7-day free trial.
- Retains PWA assets/routes and `/privacy`, `/terms`, and `/data-deletion`.

## Functional preservation
No Supabase schema, query, authentication, or backend integration files were intentionally changed as part of this visual redesign. Existing working backend behavior remains the source of truth.

## Verification performed in this environment
- TypeScript/TSX parser validation passed for every source file.
- All local `@/` imports resolve to files in the project.
- Canonical logo/app icon and all nine reference images are present.
- Pricing/trial constants were checked against the approved FORVA decisions.
- Search confirmed there are no Stripe or 14-day-trial references in `src/`, `public/`, or `package.json`.

A full Vite production build could not be executed in this container because outbound DNS access to the npm registry is disabled, so dependencies cannot be restored here. The project keeps its `package-lock.json` for deterministic install/build in GitHub or Netlify.
