# Realtime Database schema

The application validates database writes with domain-specific Zod schemas in
`source/schemas/`. Firebase Realtime Database rules enforce the persisted shape
independently in `database.rules.json`.

## Production rollout

Use this order when introducing a stricter schema:

1. Stop application writes or put the service into maintenance mode.
2. Authenticate the Admin SDK with Application Default Credentials, or set
   `FIREBASE_SERVICE_ACCOUNT_JSON` to the complete service-account JSON.
3. Run `npm run migrate`. This is a read-only dry run and stops if it finds
   unknown data that the migration would otherwise discard.
4. Run `npm run migrate:apply`. Before writing, it saves the current root to
   the gitignored `backups/` directory.
5. Deploy the application code.
6. Deploy the rules with
   `firebase --config firebase/firebase.json deploy --only database`.
7. Start application writes again and verify the logs.

Migrations are versioned under `firebase/migrations/`. The runner at
`scripts/migrate.js` reads `meta/schemaVersion` and applies only newer versions
in order. Never edit a
migration that has already been used in production; add the next version
instead. Keep the backup until production has been verified, and do not commit
the backup or service-account credentials.

## Authentication

Email/password authentication only proves the user's identity. The current
rules also require one of these authorizations for protected reads and writes:

- the token has the custom claim `bot: true`; or
- `/access/<auth.uid>` is exactly `true`.

The migration uses the Admin SDK and therefore does not depend on either rule.

## Validation

Run `npm test` for application schema and repository tests. Run
`npm run test:integration` to load `database.rules.json` into the Realtime
Database emulator and verify allowed and rejected writes.
