import { merge } from 'lodash';
import { Types } from 'mongoose';
import { DomainModel } from '../models/mongo/abstract_model';

export default class ApplicationStore {
  constructor({ logger, defaultPaginateOptions }) {
    this.logger = logger;
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  aggregate(query) {
    return DomainModel.aggregate(query);
  }

  create(payload) {
    return DomainModel.create(payload);
  }

  update(_id, payload) {
    return DomainModel.updateOne({ _id }, payload).exec();
  }

  delete(id) {
    return this.update(id, { draft: true, deletedAt: Date.now() });
  }

  publish(id) {
    return this.update(id, { draft: false, publishedAt: Date.now() });
  }

  unpublish(id) {
    return this.update(id, { draft: true });
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);

    if (mergedOptions.page && mergedOptions.offset) {
      delete mergedOptions.offset;
    }

    return DomainModel.paginate(conditions, mergedOptions);
  }

  findByIdOrSlug(idOrSlug) {
    const conditions = {};

    conditions.$or = [{ slug: idOrSlug }, { 'translation.slug': idOrSlug }];

    if (Types.ObjectId.isValid(idOrSlug)) {
      conditions.$or.push({ _id: idOrSlug });
    }

    return DomainModel.findOne(conditions);
  }

  get(id) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return DomainModel.findById(id).exec();
  }
}
