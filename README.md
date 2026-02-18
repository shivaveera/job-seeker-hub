# Job Seeker Hub

A modern, full-featured job seeker SaaS application built with React, TypeScript, and Supabase. It helps job seekers manage their job search from a single place — browse job listings, track applications, save favourite jobs, and maintain a personal profile.

## Features

- **Landing & Pricing pages** — public-facing pages introducing the product and plans
- **Authentication** — sign up and log in with Supabase Auth
- **Dashboard** — at-a-glance overview of your job search activity
- **Jobs Feed** — browse and search available job listings
- **Application Tracker** — keep track of every job you've applied to
- **Saved Jobs** — bookmark jobs to review later
- **Profile** — manage your personal information

## Tech Stack

- [Vite](https://vitejs.dev/) — fast frontend build tool
- [React 18](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) — accessible component library
- [Supabase](https://supabase.com/) — backend-as-a-service (auth & database)
- [TanStack Query](https://tanstack.com/query) — server-state management

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/shivaveera/job-seeker-hub.git

# 2. Navigate into the project directory
cd job-seeker-hub

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080` by default.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite with Vitest |

## Environment Variables

Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and ensure all tests pass (`npm test`).
3. Submit a pull request describing your changes.

## License

This project is open source. See the repository for license details.
