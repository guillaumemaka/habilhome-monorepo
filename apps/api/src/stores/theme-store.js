import Theme from '../models/mongo/theme';
import { Types } from 'mongoose';
import { merge } from 'lodash';

export default class ThemeStore {
  constructor({ defaultPaginateOptions }) {
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  aggregate(query) {
    return Theme.aggregate(query);
  }

  get(id) {
    return this.isValidId(id) ? Theme.findById(id).exec() : null;
  }

  delete(_id, options = { hard: false }) {
    if (!this.isValidId(_id)) {
      return null;
    }

    if (options.hard) {
      return Theme.findOneAndDelete({ _id }).exec();
    }

    return this.update(_id, { deletedAt: Date.now(), draft: true });
  }

  restore(_id) {
    return this.isValidId(_id)
      ? this.update(_id, { deletedAt: null, draft: false })
      : null;
  }

  create(payload) {
    return Theme.create(payload);
  }

  update(_id, doc, options = { new: true }) {
    return this.isValidId(_id)
      ? Theme.findOneAndUpdate({ _id }, doc, options)
      : null;
  }

  /**
   *
   * [{ old: '', new:''}, { language: 'en', old: '', new:''}]
   */
  updateSubThemes(_id, idx, subThemes) {
    if (!this.isValidId(_id)) {
      return null;
    }

    const doc = {};
    const arrayFilters = {};

    for (let sub of subThemes) {
      if (sub.language) {
        doc['$set'][`translation.$[lang].subThemes.$[st${sub.language}]`] =
          sub.new;
        arrayFilters.lang = { $eq: sub.language };
        arrayFilters[`$[st${sub.language}]`] = { $eq: sub.old };
      } else {
        doc['$set'][`subThemes.$[st]`] = sub.new;
        arrayFilters[`$[st]`] = { $eq: sub.old };
      }
    }

    return this.update(_id, doc, { arrayFilters });
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);
    if (mergedOptions.page && mergedOptions.offset) {
      delete mergedOptions.offset;
    }
    return Theme.paginate(conditions, mergedOptions);
  }

  findByIdOrSlug(idOrSlug) {
    const conditions = {};

    conditions.$or = [{ slug: idOrSlug }, { 'translation.slug': idOrSlug }];

    if (this.isValidId(idOrSlug)) {
      conditions.$or.push({ _id: idOrSlug });
    }

    return Theme.findOne(conditions).exec();
  }

  isValidId(id) {
    return Types.ObjectId.isValid(id);
  }
}
