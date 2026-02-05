# Car Wash Management App

A custom management application for car wash businesses, built with modern web technologies and best practices.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## About

This product is built to help my friend who owns a car wash business to manage his business more efficiently. It allows him to manage his customers, tyre hotel, and receipts in a more organized way. The app speeds up his workflow and makes it easier for him to keep track of his business.

This project also served as a good learning experience for me building a full-stack application using the latest technologies and best practices. I learned a lot about dealing with a real-world customer and their needs.

## Features

| Feature | Status |
|---------|--------|
| User Authentication | Stable |
| Tyre Hotel Management | Stable |
| Customer Management | Beta |
| Receipt Management | Beta |
| Invoice Management | Alpha |

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication:** [NextAuth v5](https://authjs.dev/)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/)
- **Email:** Nodemailer with React Email
- **PDF Generation:** React PDF Renderer
- **Testing:** [Vitest](https://vitest.dev/)

## Prerequisites

Before you clone the repo, make sure you have the following installed:

- **Node.js** >= 20.x
- **npm** >= 10.x (or pnpm/yarn)
- **PostgreSQL** database (local or hosted)
- **Upstash Redis** account (for rate limiting)
- **SMTP server** (for email)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BlendiGR/carwash-dashboard-app.git
cd carwash-dashboard-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret key for NextAuth (generate with `openssl rand -base64 32`) |
| `EMAIL_HOST` | SMTP server host |
| `EMAIL_PORT` | SMTP server port |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `NEXT_PUBLIC_APP_URL` | Your application URL |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `NEXT_PUBLIC_COMPANY_*` | Business info for invoices/receipts |

### 4. Set up the database

Generate Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

If you wan to, you can seed the database with sample data:

```bash
npm run seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
carwash-dashboard-app/
├── app/                  # Next.js App Router
│   ├── actions/          # Server actions
│   ├── api/              # API routes
│   ├── (routes-authed)   # Authenticated routes
│   └── (password-change) # Password change routes
│ 
├── components/           # React components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
├── prisma/               # Database schema & migrations
├── messages/             # i18n translation files
└── public/               # Static assets
```

## Testing

Run the test suite:

```bash
npm run test
```

## Internationalization

The app supports multiple languages using `next-intl`. Translation files are located in the `/messages` directory.