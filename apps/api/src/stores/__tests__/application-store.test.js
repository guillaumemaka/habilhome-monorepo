import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { createApplicationObject } from '../../__tests__/applications-helpers';
import { createThemesForSearch as createThemes } from '../../__tests__/themes-helpers';
import Application from '../../models/mongo/application';
import Theme from '../../models/mongo/theme';

let container;
let store;

describe('ApplicationStore', () => {
  beforeAll(async (done) => {
    await Application.deleteMany({});
    await Theme.deleteMany({});
    await Theme.insertMany(createThemes());

    container = configureContainer();
    store = container.cradle.applicationStore;
    return done();
  });

  it('container -- should be available in container', () => {
    expect(container.has('applicationStore')).toBeTruthy();
    expect(store).toBeDefined();
  });

  it('create -- should create a new Application', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject();
    const created = await store.create(app);

    expect(created).toBeDefined();
    expect(created.kind).toEqual('Application');
    expect(created.id).toBeDefined();
    expect(created.name).toEqual(app.name);
    expect(created.translation[0].name).toEqual(app.translation[0].name);
  });

  it('update -- should update an Application', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject();
    const created = await store.create(app);

    const updated = await store.update(created._id, {
      ...app,
      name: 'New Name',
    });

    expect(updated).toBeDefined();
    expect(updated.kind).toEqual('Application');
    expect(updated._id).toEqual(updated._id);
    expect(updated.name).toEqual('New Name');
    expect(updated.translation[0].name).toEqual(app.translation[0].name);
  });

  it('get -- should get an Application by id', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject();
    const { id } = await store.create(app);
    const { name, translation } = await store.get(id);

    expect(id).toBeDefined();
    expect(name).toEqual(app.name);
    expect(translation[0].name).toEqual(app.translation[0].name);
  });

  it('findByIdOrSlug -- should get an Application by id or slug', async () => {
    const application = createApplicationObject({ name: 'Dash' });
    const { id, slug } = await store.create(application);
    const { name, translation } = await store.findByIdOrSlug(slug);

    expect(id).toBeDefined();
    expect(slug).toBeDefined();

    expect(name).toEqual(application.name);
    expect(translation[0].name).toEqual(application.translation[0].name);

    const {
      name: name2,
      translation: translation2,
    } = await store.findByIdOrSlug(id);

    expect(name2).toEqual(application.name);
    expect(translation2[0].name).toEqual(application.translation[0].name);
  });

  it('delete -- should mark an Application as deleted and draftde', async () => {
    await Application.deleteMany({}).exec();
    const { id } = await store.create(createApplicationObject());
    await store.delete(id);

    const { deletedAt, draft } = await store.get(id);

    expect(id).toBeDefined();
    expect(draft).toBeTruthy();
    expect(deletedAt).toBeDefined();
  });

  it('delete(hard=true) -- should permanently delete an Application', async () => {
    await Application.deleteMany({}).exec();
    const { id } = await store.create(createApplicationObject());
    await store.delete(id, { hard: true });

    const doc = await store.get(id);

    expect(doc).toBeNull();
  });

  it('restore -- should mark an Application as not deleted and published', async () => {
    await Application.deleteMany({}).exec();
    const { id } = await store.create(createApplicationObject());
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

  it('publish -- should undraft an Application', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject();
    const { id } = await store.create({ ...app, draft: false });

    await store.publish(id);

    const { draft } = await store.get(id);
    expect(draft).toBeFalsy();
  });

  it('unpublish -- should mark an Application as draft', async () => {
    await Application.deleteMany({}).exec();
    const app = createApplicationObject();
    const { id } = await store.create({ ...app, draft: true });

    await store.unpublish(id);

    const { draft } = await store.get(id);

    expect(draft).toBeTruthy();
  });

  it('find -- should return applications for the given condition', async () => {
    await Application.deleteMany({}).exec();
    await store.create(createApplicationObject({ name: 'Clear' }));
    await store.create(createApplicationObject({ name: 'Clear 2' }));

    const { itemCount } = await store.find({ name: 'Clear' });
    expect(itemCount).toEqual(1);
  });

  it('find -- with regex should return all applications for the given condition', async () => {
    await Application.deleteMany({}).exec();
    await store.create(createApplicationObject({ name: 'Tom' }));
    await store.create(createApplicationObject({ name: 'Tom 2' }));

    const { itemCount } = await store.find({ name: /Tom/ });
    expect(itemCount).toEqual(2);
  });

  // it('find -- with $text search should Application for the given condition', async () => {
  //   await Application.deleteMany({}).exec();
  //   await store.create(createApplicationObject({ name: 'Trello 1000' }));
  //   await store.create(createApplicationObject({ name: 'Trello 2000' }));

  //   const { itemCount } = await store.find(
  //     { $text: { $search: '"trello"' } },
  //     {
  //       select: { score: { $meta: 'textScore' } },
  //       sort: { score: { $meta: 'textScore' } },
  //     }
  //   );

  //   expect(itemCount).toEqual(2);
  // });
});
