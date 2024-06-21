/**
 *
 * @param {import('@jest/types').Config.GlobalConfig} globalConfig
 * @param {import('@jest/types').Config.ProjectConfig } projectConfig
 */
module.exports = async function (_globalConfig, _projectConfig) {
  await postgresContainer.stop();
};
