var Keys = require('./src/Keys');
/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */


var appName = "production" !== process.env.NODE_ENV ? 'DEV: Birder Vs Birder' : 'Birder Vs Birder';
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [appName],
  /**
   * Your New Relic license key.
   */
  license_key: Keys.newrelic,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
