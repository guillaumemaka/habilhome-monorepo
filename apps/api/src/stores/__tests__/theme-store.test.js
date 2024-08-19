import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { createThemeObject } from '../../__tests__/themes-helpers';
import Theme from '../../models/mongo/theme';

let container;
let store;

describe('ThemeStore', () => {
  beforeAll(async () => {
    container = configureContainer();
    store = container.cradle.themeStore;
    await Theme.deleteMany({}).exec();
  });

  beforeEach(async (done) => {
    await Theme.deleteMany({}).exec();
    return done();
  });

  it('container -- should be available in container', () => {
    expect(container.has('themeStore')).toBeTruthy();
    expect(store).toBeDefined();
  });

  it('findByIdOrSlug -- should get a Theme by id or slug', async () => {
    const theme = createThemeObject({ name: 'Travail' });
    const { id, slug } = await store.create(theme);
    const { name, translation } = await store.findByIdOrSlug(slug);

    expect(id).toBeDefined();
    expect(slug).toBeDefined();

    expect(name).toEqual(theme.name);
    expect(translation[0].name).toEqual(theme.translation[0].name);

    const {
      name: name2,
      translation: translation2,
    } = await store.findByIdOrSlug(slug);

    expect(name2).toEqual(theme.name);
    expect(translation2[0].name).toEqual(theme.translation[0].name);
  });

  it('create -- create the given theme', async () => {
    const theme = createThemeObject();
    const created = await store.create(theme);
    expect(created).toBeDefined();
    expect(created.name).toEqual(theme.name);
    expect(created.translation[0].name).toEqual(theme.translation[0].name);

    await Theme.deleteOne({ _id: created.id }).exec();
  });

  it('delete -- mark as deleted and draft the given theme', async () => {
    const theme = createThemeObject();
    const created = await store.create(theme);
    await store.delete(created.id);

    const deleted = await store.get(created.id);

    expect(deleted.deletedAt).toBeDefined();
    expect(deleted.draft).toBeTruthy();

    await Theme.deleteOne({ _id: created.id }).exec();
  });

  it('delete(hard=true) -- should permanently delete a Theme', async () => {
    await Theme.deleteMany({}).exec();
    const { id } = await store.create(createThemeObject());
    await store.delete(id, { hard: true });

    const doc = await store.get(id);

    expect(doc).toBeNull();
  });

  it('restore -- should mark a Theme as not deleted and published', async () => {
    await Theme.deleteMany({}).exec();
    const { id } = await store.create(createThemeObject());
    await store.delete(id);

    const { _id, deletedAt, draft } = await store.get(id);

    expect(id).toBeDefined();
    expect(draft).toBeTruthy();
    expect(deletedAt).toBeDefined();

    const doc = await store.restore(_id);

    expect(doc.id).toBeDefined();
    expect(doc.draft).toBeFalsy();
    expect(doc.deletedAt).toBeNull();
  });

  it('update -- update the given theme', async () => {
    const theme = createThemeObject();
    const created = await store.create(theme);
    await store.update(
      created.id,
      {
        $set: {
          'subThemes.$[st]': 'maj',
          'translation.$[lang].subThemes.$[stEn]': 'updated',
        },
      },
      {
        multi: false,
        arrayFilters: [
          { 'lang.language': { $eq: 'en' } },
          { stEn: { $eq: theme.translation[0].subThemes[5] } },
          { st: { $eq: theme.subThemes[5] } },
        ],
      }
    );

    const updated = await store.get(created.id);

    expect(updated.subThemes[5]).toEqual('maj');
    expect(updated.translation[0].subThemes[5]).toEqual('updated');

    await Theme.deleteOne({ _id: created.id }).exec();
  });

  // it('find -- fts - default language (french)', async () => {
  //   await Theme.insertMany(createThemesForSearch());

  //   const conditions = {
  //     $text: { $search: '"planifier un budget"' },
  //     deletedAt: null,
  //     draft: false,
  //   };

  //   const opts = {
  //     select: { score: { $meta: 'textScore' } },
  //     sort: { score: { $meta: 'textScore' } },
  //   };

  //   const { itemCount } = await store.find(conditions, opts);

  //   expect(itemCount).toEqual(1);

  //   await Theme.deleteMany({}).exec();
  // });

  // it('find -- fts - with language (english)', async () => {
  //   await Theme.insertMany(createThemesForSearch());

  //   const conditions = {
  //     $text: { $search: '"Plan a budget"', $language: 'en' },
  //     deletedAt: null,
  //     draft: false,
  //   };

  //   const opts = {
  //     select: { score: { $meta: 'textScore' } },
  //     sort: { score: { $meta: 'textScore' } },
  //   };

  //   const { itemCount } = await store.find(conditions, opts);

  //   expect(itemCount).toEqual(1);

  //   await Theme.deleteMany({}).exec();
  // });
});
