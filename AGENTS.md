# Next.js "WHA" App Starter

This repository uses a specific Next.js 16 version with breaking changes.

## Critical Rules
- **Next.js 16:** APIs, conventions, and file structures deviate significantly from standard Next.js.
- **Verification:** Always refer to `node_modules/next/dist/docs/` before implementing new features or architectural changes.
- **Overrides:** Note the `@types/react` and `@types/react-dom` overrides in `package.json`.
- **Database:** Prisma schema is in `/prisma`. Use `npx prisma generate` after modifying models.
- **Naming Conventions:** Service files must use `.service.ts` suffix (e.g., `api.service.ts`).

## Development Commands
- `npm run dev`: Start development server.
- `npm run build`: Production build.
- `npm run lint`: Run ESLint.

## Project Structure & Stack
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4.0 (uses `@tailwindcss/postcss`)
- **Database:** Prisma 7.8, MariaDB adapter.
- **Auth:** Better-Auth 1.6
- **Forms:** React Hook Form + Zod resolvers.
- **State:** Zustand 5.0

## Gotchas
- If docs in the repo seem dated, prioritize `node_modules/next/dist/docs/` as the source of truth for framework-specific behavior.
- Ensure environment variables are correctly configured in `.env` for database connectivity.

## ข้อกำหนดหลัก
- แยก TypeScript Type ทุกอย่าง ออกไปไว้ที่โฟลเดอร์ src/types
- การตั้งชื่อไฟล์ TypeScript (.ts) ให้ตั้งตามตัวอย่างนี้ คือ course-service.ts
- ห้ามใช้คำสั่ง npx prisma db push
