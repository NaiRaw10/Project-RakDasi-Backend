# 🚀 Backend Project Katalog Buku & RBAC (Express.js & TypeScript)

Proyek backend ini pakai Node.js, Express, TypeScript, dan MySQL, terus sudah ada sistem Role buat bedain hak akses antara Admin sama User. Selain itu, dilengkapi juga sama login JWT dan fitur buat kelola data buku!

---

## 📂 Struktur Folder Project

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── bookController.ts
│   │
│   ├── middlewares/
│   │   ├── adminMiddlewares.ts
│   │   └── authMiddlewares.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── bookRoutes.ts
│   │
│   └── app.ts
│
├── package.json
├── tsconfig.json
└── README.md