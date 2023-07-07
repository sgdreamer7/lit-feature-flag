import browserSync from 'browser-sync';
import config from './convict.js'

browserSync({
  server: {
    baseDir: './dist',
    middleware: [
      function (req, res, next) {
        res.setHeader('set-cookie', `feature-flags-features=${config.get('features')}`);
        res.setHeader('x-feature-flags', config.get('features'));

        next();
      }
    ]
  },
  port: config.get('developmentPort'),
  startPath: 'index.html',
  watch: true,
  cors: true,
  ui: {
    port: Number(config.get('browserSyncPort')),
  }
});
