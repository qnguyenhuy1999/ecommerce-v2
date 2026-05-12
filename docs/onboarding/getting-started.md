# Getting Started

## Prerequisites

| Tool    | Version | Install                                                        |
| ------- | ------- | -------------------------------------------------------------- |
| Node.js | >= 24   | [nodejs.org](https://nodejs.org/)                              |
| PNPM    | >= 11   | `npm install -g pnpm@11`                                       |
| Docker  | Latest  | [docker.com](https://www.docker.com/) (for PostgreSQL + Redis) |

## Setup

```bash
# Clone the repo
git clone https://github.com/qnguyenhuy1999/ecommerce-v2.git
cd ecommerce-v2

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your local values (DATABASE_URL, JWT secrets, etc.)

# Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed sample data
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

## Local URLs

| App                 | URL                   |
| ------------------- | --------------------- |
| Storefront          | http://localhost:3000 |
| Seller Dashboard    | http://localhost:3001 |
| Admin Dashboard     | http://localhost:3002 |
| Storefront API      | http://localhost:4000 |
| Admin API           | http://localhost:4002 |
| Seller API          | http://localhost:4003 |
| Storybook (core-ui) | http://localhost:6006 |

## Common Tasks

```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Format code
pnpm format

# Build everything
pnpm build
```

## Project Structure

See [Architecture Overview](../architecture/overview.md) and [Folder Structure](../conventions/folder-structure.md).

## Key Conventions

- [Naming Conventions](../conventions/naming-conventions.md)
- [API Standards](../engineering/api-standards.md)
- [PR Checklist](../conventions/pull-request-checklist.md)
