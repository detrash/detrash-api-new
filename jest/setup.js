const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');

/**
 *
 * @param {import('@jest/types').Config.GlobalConfig} globalConfig
 * @param {import('@jest/types').Config.ProjectConfig } projectConfig
 */
module.exports = async function (_globalConfig, _projectConfig) {
  console.log(`\nSetting up test environment...`);

  const postgresContainer = await new PostgreSqlContainer().start();
  const connectionString = postgresContainer.getConnectionUri();

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: 'drizzle' });
  await sql.end();

  process.env.POSTGRES_DB_URL = connectionString;

  // Register this for teardown
  globalThis.postgresContainer = postgresContainer;
};
