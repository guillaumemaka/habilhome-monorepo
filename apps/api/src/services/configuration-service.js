import { SettingModel } from '../models/mongo';
import { ADMIN_SCOPE } from '../models/mongo/setting';

export default class ConfigurationService {
  constructor({ logger }) {
    this.logger = logger;
  }

  /**
   * Get all admin scoped configuration
   * @param scopes array of scope
   */
  async all(scopes = [ADMIN_SCOPE]) {
    const configs = await SettingModel.find().lean();
    return configs.map((c) => {
      const fields = filterFields(c.fields, scopes);
      return { ...c, fields };
    });
  }

  /**
   * Get config for the given section
   * @param section configuration section name
   */
  async getSection(section, scopes = [ADMIN_SCOPE]) {
    const config = await SettingModel.findOne({ section }).lean();
    if (config) {
      config.fields = filterFields(config.fields, scopes);
    }
    return config;
  }

  /**
   * Update configuration for a section / field
   * @param section configuration section
   * @param field   configuration field on the given section
   * @param value   configuration field value on the given section
   */
  async update(section, field, value) {
    const query = {
      section: section,
      'fields.name': field,
    };

    let sectionObj = await SettingModel.findOneAndUpdate(
      query,
      {
        $set: {
          'fields.$.value': value,
        },
      },
      { new: true, lean: true }
    ).exec();

    return sectionObj;
  }

  async createOrUpdateIfNotExist(section, field, newOrUpdate) {
    const fieldExist = await this.getField(section, field);
    const sectionExist = await SettingModel.exists({ section });

    if (sectionExist && fieldExist) {
      return null;
    }
    return this.createOrUpdate(section, field, newOrUpdate);
  }

  /**
   * Create or update a field
   * @param section section name
   * @param newOrUpdate   see SettingModel[fields]
   */
  async createOrUpdate(section, field, newOrUpdate) {
    const query = {
      section: section,
      'fields.name': field,
    };

    let fieldExist = await this.getField(section, field);
    let sectionExist = await SettingModel.exists({ section });

    if (!sectionExist) {
      await SettingModel.updateOne(
        query,
        {
          $set: { section },
          $setOnInsert: {
            fields: newOrUpdate,
          },
        },
        { upsert: true }
      ).exec();

      return SettingModel.findOne(query).lean();
    }

    if (sectionExist && !fieldExist) {
      await SettingModel.updateOne(
        { section: section },
        {
          $push: {
            fields: newOrUpdate,
          },
        }
      ).exec();

      return SettingModel.findOne(query).lean();
    }

    if (sectionExist && fieldExist) {
      const updatedField = { ...fieldExist, ...newOrUpdate };

      await SettingModel.updateOne(query, {
        $set: { 'fields.$': updatedField },
      }).exec();

      return SettingModel.findOne({
        section,
        'fields.name': updatedField.name,
      }).lean();
    }

    return SettingModel.findOne(query).lean();
  }

  /**
   * Get configuration for a section / field
   * @param section configuration section
   * @param field   configuration field on the given section
   */
  async getField(section, field, scopes = null) {
    const results = await SettingModel.aggregate([
      {
        $match: {
          section: section,
          'field.name': field.name,
          ...(scopes === null ? {} : { 'fields.scope': { $in: scopes } }),
        },
      },
      {
        $unwind: {
          path: '$fields',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'fields.name': field,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$fields',
        },
      },
    ]);

    return results.length > 0 ? results[0] : undefined;
  }
}

function filterFields(fields, scopes) {
  if (!scopes) {
    return fields;
  }

  const filtered = [];
  for (const s of scopes) {
    for (const f of fields) {
      if (f.scope.includes(s)) {
        filtered.push(f);
      }
    }
  }
  return filtered;
}
