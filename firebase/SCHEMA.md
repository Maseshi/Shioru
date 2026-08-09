# Realtime Database schema

The application validates database writes with domain-specific Zod schemas in
`source/schemas/`. Firebase Realtime Database rules enforce the persisted shape
independently in `database.rules.json`.

## Authentication

Email/password authentication only proves the user's identity. The current
rules also require one of these authorizations for protected reads and writes:

- the token has the custom claim `bot: true`; or
- `/access/<auth.uid>` is exactly `true`.

## Validation

Run `npm test` for application schema and repository tests. Run
`npm run test:integration` to load `database.rules.json` into the Realtime
Database emulator and verify allowed and rejected writes.
