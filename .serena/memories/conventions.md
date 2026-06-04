# Conventions

- Styling:
  - Tailwind CSS v4 (configured via Vite). Custom utilities should follow Tailwind v4 patterns.
  - Component-based structure with inline or Tailwind styling.
- Types:
  - Keep types defined in `src/types.ts`. All data structures (donations, progress, church events) must align with the type definitions there.
- Performance & Edits:
  - Do not modify HMR / file watch settings in `vite.config.ts` (`hmr: process.env.DISABLE_HMR !== 'true'`).
- AI Integrations:
  - Use `@google/genai` library for Google Gemini APIs. Configure environment keys properly in `.env.local` / `.env`.