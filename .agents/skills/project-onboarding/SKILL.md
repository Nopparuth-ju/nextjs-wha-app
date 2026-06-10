---
name: project-onboarding
description: Use When a new developer asks about setup project. how to get started, what tech stack is used. Triggers on "โปรเจกต์ตั้งค่าอย่างไร", "โปรเจกต์นี้เริ่มต้นอย่างไร". or any orientation question from someone unfamiliar with the code base.
compatibility: Use Node.js 22+
license: MIT
metadata: 
  author: Nopparuth Julayanont
  version: "1.0"
---

## First-Time Setup 

```
# 1. Install Deps
npm install

# 2. Copy env
cp .env.example .env

# 3. Pull DB Schema (Prisma ORM)
npx prisma db pull

# 4. Generate Prisma Client
npx prisma generate

# 5. checke lint
npm run lint
```

## Gotchas

- ต้องติดตั้ง และปิด Docker Desktop ไว้
- ให้อธิบายการรันโปรเจกต์ ต้องใช้คำสั่ง `npm run dev` 

## Output

- ถ้าถามการ Setup ให้ตอบในรูปแบบของตาราง และให้อ่านง่าย 