import { Bristol } from 'bristol';
import palin from 'palin';

export const logger = new Bristol();

process.env.LOG_LEVEL =
  process.env.NODE_ENV === 'test' ? 'off' : process.env.LOG_LEVEL;

/* istanbul ignore next */
if (process.env.LOG_LEVEL !== 'off') {
  logger.addTarget('console').withFormatter(palin, {
    rootFolderName: 'vt-rest-api', // Edit this to match your actual foldername
  });
}
