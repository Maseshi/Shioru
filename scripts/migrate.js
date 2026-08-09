const { mkdir, writeFile } = require("node:fs/promises");
const { join, resolve } = require("node:path");
const {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const {
  DATABASE_SCHEMA_VERSION,
  DatabaseRootSchema,
} = require("../source/schemas/root");
const migrationV1 = require("../firebase/migrations/v1");

const migrations = [migrationV1].sort(
  (left, right) => left.version - right.version,
);

const validateRegistry = () => {
  migrations.forEach((migration, index) => {
    const expectedVersion = index + 1;
    if (migration.version !== expectedVersion)
      throw new Error(`Missing database migration v${expectedVersion}.`);
  });

  const latestVersion = migrations.at(-1)?.version ?? 0;
  if (latestVersion !== DATABASE_SCHEMA_VERSION)
    throw new Error(
      `Latest migration is v${latestVersion}, but schema is v${DATABASE_SCHEMA_VERSION}.`,
    );
};

const getSchemaVersion = (database) => {
  const version = database?.meta?.schemaVersion ?? 0;
  if (!Number.isInteger(version) || version < 0)
    throw new Error("Database schemaVersion must be a nonnegative integer.");
  if (version > DATABASE_SCHEMA_VERSION)
    throw new Error(
      `Database schema v${version} is newer than supported v${DATABASE_SCHEMA_VERSION}.`,
    );
  return version;
};

const runMigrations = (database = {}, migratedAt = new Date()) => {
  validateRegistry();

  const fromVersion = getSchemaVersion(database);
  const appliedVersions = [];
  let migrated = database;

  for (const migration of migrations) {
    if (migration.version <= fromVersion) continue;
    migrated = migration.migrate(migrated, migratedAt);
    if (migrated.meta?.schemaVersion !== migration.version)
      throw new Error(
        `Migration v${migration.version} did not update schemaVersion.`,
      );
    appliedVersions.push(migration.version);
  }

  return {
    appliedVersions,
    data: DatabaseRootSchema.parse(migrated),
    fromVersion,
    toVersion: DATABASE_SCHEMA_VERSION,
  };
};

const loadCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  return applicationDefault();
};

const createAdminApp = () => {
  if (getApps().length) return getApps()[0];

  const options = {
    projectId: process.env.PROJECT_ID,
    databaseURL: process.env.DATABASE_URL,
  };
  if (!process.env.FIREBASE_DATABASE_EMULATOR_HOST)
    options.credential = loadCredential();
  return initializeApp(options);
};

const run = async () => {
  if (!process.env.PROJECT_ID || !process.env.DATABASE_URL)
    throw new Error("PROJECT_ID and DATABASE_URL are required.");

  const apply = process.argv.includes("--apply");
  const database = getDatabase(createAdminApp());
  const rootRef = database.ref();
  const snapshot = await rootRef.once("value");
  const current = snapshot.val() ?? {};
  const result = runMigrations(current);
  const applied = result.appliedVersions.join(", ") || "none";

  if (!apply) {
    console.log(
      `Migration validated: v${result.fromVersion} -> v${result.toVersion} (apply: ${applied}).`,
    );
    if (result.appliedVersions.length)
      console.log("Run npm run migrate:apply to back up and apply it.");
    else console.log("Database schema is already up to date.");
    return;
  }

  if (!result.appliedVersions.length) {
    console.log(`Database is already at schema v${DATABASE_SCHEMA_VERSION}.`);
    return;
  }

  const backupDirectory = resolve(__dirname, "../backups");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = join(
    backupDirectory,
    `database-before-schema-v${DATABASE_SCHEMA_VERSION}-${timestamp}.json`,
  );
  await mkdir(backupDirectory, { recursive: true });
  await writeFile(backupPath, `${JSON.stringify(current, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rootRef.set(result.data);

  console.log(`Database migrated to schema v${DATABASE_SCHEMA_VERSION}.`);
  console.log(`Backup written to ${backupPath}.`);
};

if (require.main === module)
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

module.exports = { getSchemaVersion, runMigrations };
