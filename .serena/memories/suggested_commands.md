# Suggested Commands

- Start Dev Server:
  `npm run dev`
  Starts Vite development server on port 3000.
- Build Project:
  `npm run build`
- Preview Build:
  `npm run preview`
- Clean Build:
  `npm run clean`
- Type Checking / Linting:
  `npm run lint` (runs `tsc --noEmit`)
- Git / File System commands on Windows:
  - Avoid unix-only shell utilities directly unless supported by PowerShell/cmd. Use `powershell` compatible forms.
  - Environment variables: Use `$env:VAR = "value"` or set in `.env.local` files instead of inline `VAR=value command`.