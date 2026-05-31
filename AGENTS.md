# AGENTS

## Purpose
This file helps AI coding agents understand the `PW-API-Testing` repository and suggest code that matches existing conventions.

## Project overview
- Playwright API test repository using TypeScript and `@playwright/test`.
- Tests are stored under `tests/` and use the Playwright request API.
- Custom fixture support is implemented in `utils/fixtures.ts` and `utils/request-handler.ts`.
- The default API base URL is `https://conduit-api.bondaracademy.com/api/`.

## Key commands
- `npm test` — run Playwright tests
- `npm run test:headed` — run tests in headed mode
- `npm run show-report` — display the Playwright HTML report

## Important conventions
- Keep test files in `tests/` and name them with `.spec.ts`.
- Use `test`, `expect`, and the built-in Playwright request fixture in API tests.
- Prefer `async ({ request }) => { ... }` and explicit `expect(...).toEqual(...)` assertions.
- Use the custom `api` fixture when adding reusable request-builder logic.
- Avoid adding browser automation unless the project expands beyond API testing.
- Keep code minimal and focused on API request/response validation.

## Files to inspect for patterns
- `playwright.config.ts` — test configuration, reporters, retries, and worker settings.
- `tests/apibasics.spec.ts` — real API tests with setup and assertions.
- `tests/smokeTest.spec.ts` — custom fixture usage example.
- `utils/fixtures.ts` — defines the `api` fixture.
- `utils/request-handler.ts` — request builder helper.

## Auto-suggestion guidance
- When writing or updating tests, use the existing Playwright API style and the current repository structure.
- Prefer extending `utils/fixtures.ts` for reusable request helper logic.
- Do not introduce unrelated frameworks or non-Playwright test runners.
- Keep generated suggestions aligned with a TypeScript CommonJS setup.
