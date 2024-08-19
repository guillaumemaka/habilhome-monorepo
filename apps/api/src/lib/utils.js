import _ from 'lodash';
import Theme from '../models/mongo/theme';
import { logger } from '../lib/logger';

export function transformSort(sort) {
  return _.fromPairs(
    _.split(sort, ',')
      .map((sort) => {
        const [field, value] = _.split(_.trim(sort), ':');
        return [field, parseInt(value)];
      })
      .filter((pair) => pair.length % 2 === 0)
  );
}

export async function populateThemes(entity) {
  let subThemes = [];

  if (entity.subThemes && entity.subThemes.length > 0) {
    subThemes = subThemes.concat(entity.subThemes);
  }

  if (entity.translation && entity.translation.length > 0) {
    for (let i = 0; i < entity.translation.length; i++) {
      if (
        entity.translation[i].subThemes &&
        entity.translation[i].subThemes.length > 0
      ) {
        subThemes = subThemes.concat(entity.translation[i].subThemes);
      }
    }
  }

  if (subThemes.length > 0) {
    const themes = await Theme.find({
      $or: [
        { subThemes: { $in: subThemes } },
        { 'translation.subThemes': { $in: subThemes } },
      ],
    });
    entity.themes = themes.map((t) => t.name);
    const translatedThemes = themes.reduce((prev, curr) => {
      return prev.concat(curr.translation);
    }, []);
    logger.debug({ translatedThemes });

    for (let i = 0; i < entity.translation.length; i++) {
      const translatedTheme = _.find(translatedThemes, {
        language: entity.translation[i].language,
      });
      logger.debug({ translatedTheme });
      entity.translation[i].themes = [
        ...entity.translation[i].themes,
        translatedTheme.name,
      ];
    }
  } else {
    entity.themes = [];
    if (entity.translation && Array.isArray(entity.translation)) {
      for (const translation of entity.translation) {
        translation.themes = [];
      }
    }
  }

  return entity;
}
