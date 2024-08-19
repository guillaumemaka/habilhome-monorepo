import User from '../models/mongo/user';
import bcrypt from 'bcryptjs';
import { merge } from 'lodash';
export default class UserStore {
  constructor({ logger, defaultPaginateOptions }) {
    this.logger = logger;
    this.defaultPaginateOptions = defaultPaginateOptions;
  }

  create(payload) {
    const { password, ...rest } = payload;
    const user = new User(rest);
    user.setPassword(password);
    return user.save();
  }

  update(_id, doc, options = { new: true, fields: { password: 0 } }) {
    if (doc.password) {
      doc.password = bcrypt.hashSync(doc.password, 10);
    }

    return User.findOneAndUpdate({ _id }, doc, options);
  }

  get(id) {
    return User.findById(id).exec();
  }

  delete(id) {
    return User.findByIdAndUpdate(id, {
      deletedAt: Date.now(),
      active: false,
    }).exec();
  }

  restore(id) {
    return User.findByIdAndUpdate(id, { deletedAt: null, active: true }).exec();
  }

  remove(id) {
    return User.findByIdAndDelete(id).exec();
  }

  find(conditions, options = {}) {
    const mergedOptions = merge(this.defaultPaginateOptions, options);
    if (mergedOptions.page && mergedOptions.offset) {
      delete mergedOptions.offset;
    }
    return User.paginate(conditions, mergedOptions);
  }

  findOne(conditions, projections = {}) {
    return User.findOne(conditions, projections).exec();
  }

  exists(conditions) {
    return User.exists(conditions);
  }
}
