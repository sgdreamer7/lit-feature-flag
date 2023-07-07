import convict from 'convict';
import validators from 'convict-format-with-validator';

convict.addFormats(validators);

const config = convict({
  buildEnvironment: {
    env: 'BUILD',
    doc: 'Build environment',
    format: String,
    default: 'LOCAL',
  },
  developmentPort: {
    env: 'PORT',
    doc: 'TCP port to listen for the development server',
    format: 'port',
    default: 8080,
  },
  browserSyncPort: {
    env: 'BROWSER_SYNC_PORT',
    doc: 'TCP port to listen for the browser-sync server',
    format: 'port',
    default: 8081,
  },
  features: {
    env: 'FEATURES',
    doc: 'List of the features set by browser-sync for the debugging purposes',
    format: String,
    default: 'Awesome feature 3|Awesome feature 4',
  }
});

export default config;