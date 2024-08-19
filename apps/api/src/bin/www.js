import { createServer } from '../lib/server';
import { logger } from '../lib/logger';
import { connect } from '../lib/mongoose';

const PORT = process.env.PORT || 4000;

createServer().then(
  (app) =>
    app.listen(PORT, () => {
      const mode = process.env.NODE_ENV;
      logger.debug(`Server listening on ${PORT} in ${mode} mode`);
      connect();
    }),
  (err) => {
    logger.error('Error while starting up server', err);
    process.exit(1);
  }
);
