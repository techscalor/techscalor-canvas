<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- All app data/auth/storage goes through `src/lib/supabase.ts`, which targets the owner's external Supabase project (env `VITE_APP_SUPABASE_*` with hardcoded public fallbacks) — never `@/integrations/supabase/*`, because that client and `.env` are auto-managed for an unused Lovable Cloud instance.
- Schema changes go in `db/migrations/NNNN_*.sql` and are mirrored into `db/setup.sql` (full idempotent setup), applied to the external project via psql — the Lovable migration tool targets the wrong database.
- Keep `package-lock.json` in sync with `bun.lock` whenever dependencies change (same versions, registry.npmjs.org URLs) — Vercel installs with npm from `package-lock.json`, so a stale npm lockfile ships different, possibly vulnerable, versions.
