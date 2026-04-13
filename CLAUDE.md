@AGENTS.md

# Synapse - AI Content Repurposer

## Architecture Rules
- We are using Next.js 15 (App Router), TypeScript, and Tailwind CSS.
- Strictly follow a Feature-Driven Architecture. Do not put heavy logic in `src/app`.
- UI Components must be imported from `src/components/ui` (shadcn/ui).
- Do not write custom CSS classes if a Tailwind utility class exists.

## Coding Standards
- All new files must be in TypeScript (`.ts` or `.tsx`).
- Use modern ES6+ syntax. Avoid `var`. Prefer `const` and `let`.
- When writing async functions, always use `async/await` and wrap database/API calls in `try/catch` blocks.
- If generating UI, ensure it supports both light and dark mode using Tailwind's `dark:` modifier. 

## Database
- We use Supabase. Never write raw SQL; always use the Supabase JS client.