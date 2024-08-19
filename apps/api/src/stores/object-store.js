import ConnectedObject from '../models/mongo/connected_object';
import { merge } from 'lodash';
import { Types } from 'mongoose';
import { populateThemes } from '../lib/utils';

export default class ObjectStore {
  constructor({ logger, defaultPaginateOptions }) {
    this.logger = logger;
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  async create(payload) {
    const object = await populateThemes(payload);
    return ConnectedObject.create(object);
  }

  async update(_id, payload, options = { new: true }) {
    const object = await populateThemes(payload);
    return ConnectedObject.findOneAndUpdate({ _id }, object, options).exec();
  }

  delete(_id, options = { hard: false }) {
    if (options.hard) {
      return ConnectedObject.findOneAndDelete({ _id }).exec();
    }
    return ConnectedObject.findOneAndUpdate(
      { _id },
      { draft: true, deletedAt: Date.now() },
      { new: true }
    ).exec();
  }

  restore(_id) {
    return ConnectedObject.findOneAndUpdate(
      { _id },
      { draft: false, deletedAt: null },
      { new: true }
    ).exec();
  }

  publish(_id) {
    return ConnectedObject.findOneAndUpdate(
      { _id },
      { draft: false, publishedAt: Date.now() },
      { new: true }
    ).exec();
  }

  unpublish(_id) {
    return ConnectedObject.findOneAndUpdate(
      { _id },
      { draft: true, publishedAt: null },
      { new: true }
    ).exec();
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);
    return ConnectedObject.paginate(conditions, mergedOptions);
  }

  findByIdOrSlug(idOrSlug) {
    const conditions = {};

    conditions.$or = [{ slug: idOrSlug }, { 'translation.slug': idOrSlug }];

    if (Types.ObjectId.isValid(idOrSlug)) {
      conditions.$or.push({ _id: idOrSlug });
    }

    return ConnectedObject.findOne(conditions);
  }

  get(id) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return ConnectedObject.findById(id).exec();
  }
}
