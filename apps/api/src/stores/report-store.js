import { Report } from '../models/mongo';
import { STATUS_FAILED, STATUS_PASSED } from '../models/mongo/link_bot_report';
import { merge } from 'lodash';
import { Types } from 'mongoose';

export default class ReportStore {
  constructor({ logger, defaultPaginateOptions }) {
    this.logger = logger;
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);

    if (mergedOptions.page && mergedOptions.offset) {
      delete mergedOptions.offset;
    }

    if (conditions.status) {
      // Strip down invalid status - default status=PASSED
      if (
        [STATUS_FAILED, STATUS_PASSED].indexOf(
          conditions.status.toUpperCase()
        ) === -1
      ) {
        conditions.status = STATUS_PASSED;
      }
    }

    return Report.paginate(conditions, mergedOptions);
  }

  get(id) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return Report.findById(id).exec();
  }

  update(_id, doc, options = { new: true }) {
    return Report.findOneAndUpdate({ _id }, doc, options);
  }
}
