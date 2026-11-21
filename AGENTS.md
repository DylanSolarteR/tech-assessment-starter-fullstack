# Repository Guidelines

## Project Structure & Module Organization

Two TypeScript packages are coordinated by root npm scripts:

- `api/src/`: NestJS modules, controllers, and services; unit tests sit beside source files.
- `api/test/`: HTTP end-to-end tests.
- `web/src/`: React components, styles, and the API URL helper (`api.ts`).
- `web/public/`: static assets, including the favicon.

Keep backend features within NestJS modules. Explain substantial structural changes in the README.

## Build, Test, and Development Commands

Use Node 22 (`.nvmrc`) and npm 10 or newer. Run these commands from the repository root:

- `npm install`: install root dependencies and both packages through `postinstall`.
- `npm run dev`: start the API on port 3000 and Vite on port 5173 with file watching.
- `npm run dev:api` / `npm run dev:web`: run either package independently.
- `npm run build`: compile the API and type-check/build the frontend.
- `npm run lint`: lint both packages with oxlint; API linting is type-aware.
- `npm test`: run API unit tests once with Vitest.
- `npm run test:e2e --prefix api`: run API HTTP tests.
- `npm run test:cov --prefix api`: collect API coverage.

## Coding Style & Naming Conventions

Use two-space indentation and single quotes. Match local conventions: API files use semicolons; frontend files omit them. Format API files with `npm run format --prefix api` (Prettier, trailing commas enabled).

Use PascalCase for classes and React components, camelCase for functions and variables, and NestJS filenames such as `orders.controller.ts`. Preserve `.js` extensions in API relative imports for NodeNext module resolution. Follow React Hooks rules and handle asynchronous failures.

## Testing Guidelines

Use Vitest with NestJS testing utilities; HTTP tests use Supertest. Name unit tests `*.spec.ts` and end-to-end tests `*.e2e-spec.ts`. Cover changed behavior and relevant failure cases. No coverage threshold or frontend test runner is currently configured. Run lint, unit tests, and builds before submitting; run end-to-end tests for API changes.

## Commit & Pull Request Guidelines

The initial commit uses a Conventional Commits prefix (`chore:`). Continue with concise messages such as `feat: add orders endpoint` or `fix: handle API errors`.

PRs should describe behavior changes, validation performed, and relevant issues. Include screenshots for UI changes. Document setup changes, architectural decisions, omissions, and follow-up work in the README.

## Configuration & Security

Use `web/.env.example` for `VITE_API_URL`. Configure API CORS with `WEB_ORIGIN` and its listening port with `PORT`. Keep secrets out of Vite variables and Git; local environment files are ignored.
