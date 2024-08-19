import { merge } from 'lodash';
import { Types } from 'mongoose';
import { Application } from '../models/mongo/abstract_model';
import { populateThemes } from '../lib/utils';

export default class ApplicationStore {
  constructor({ logger, defaultPaginateOptions }) {
    this.logger = logger;
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  async create(app) {
    const application = await populateThemes(app);
    return Application.create(application);
  }

  async update(_id, app, options = { new: true }) {
    const application = await populateThemes(app);
    return Application.findOneAndUpdate({ _id }, application, options).exec();
  }

  delete(_id, options = { hard: false }) {
    if (options.hard) {
      return Application.findOneAndDelete({ _id }).exec();
    }
    return Application.findOneAndUpdate(
      { _id },
      { draft: true, deletedAt: Date.now() },
      { new: true }
    ).exec();
  }

  restore(_id) {
    return Application.findOneAndUpdate(
      { _id },
      { draft: false, deletedAt: null },
      { new: true }
    ).exec();
  }

  publish(_id) {
    return Application.findOneAndUpdate(
      { _id },
      { draft: false, publishedAt: Date.now() },
      { new: true }
    ).exec();
  }

  unpublish(_id) {
    return Application.findOneAndUpdate(
      { _id },
      { draft: true, publishedAt: null },
      { new: true }
    ).exec();
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);
    return Application.paginate(conditions, mergedOptions);
  }

  findByIdOrSlug(idOrSlug) {
    const conditions = {};

    conditions.$or = [{ slug: idOrSlug }, { 'translation.slug': idOrSlug }];

    if (Types.ObjectId.isValid(idOrSlug)) {
      conditions.$or.push({ _id: idOrSlug });
    }

    return Application.findOne(conditions);
  }

  get(id) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return Application.findById(id).exec();
  }
}
