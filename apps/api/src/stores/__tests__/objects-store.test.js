// eslint-disable-next-line no-unused-vars
import { apiHelper } from '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { createObject } from '../../__tests__/objects-helpers';
import { createThemesForSearch as createThemes } from '../../__tests__/themes-helpers';
import Theme from '../../models/mongo/theme';
import ConnectedObject from '../../models/mongo/connected_object';

let container;
let store;

describe('ObjectStore', () => {
  beforeAll(async (done) => {
    await ConnectedObject.deleteMany({});
    await Theme.deleteMany({});
    await Theme.insertMany(createThemes());
    container = configureContainer();
    store = container.cradle.objectStore;
    return done();
  });

  beforeEach(async (done) => {
    await ConnectedObject.deleteMany({}).exec();
    return done();
  });

  it('container -- should be available in container', () => {
    expect(container.has('objectStore')).toBeTruthy();
    expect(store).toBeDefined();
  });

  it('create -- should create a new Object', async () => {
    const object = createObject();
    const created = await store.create(object);

    expect(created).toBeDefined();
    expect(created.kind).toEqual('ConnectedObject');
    expect(created.id).toBeDefined();
    expect(created.name).toEqual(object.name);
    expect(created.translation[0].name).toEqual(object.translation[0].name);
  });

  it('update -- should update an exisiting Object', async () => {
    const object = createObject();
    const created = await store.create(object);

    expect(created).toBeDefined();
    expect(created.kind).toEqual('ConnectedObject');
    expect(created.id).toBeDefined();
    expect(created.name).toEqual(object.name);
    expect(created.translation[0].name).toEqual(object.translation[0].name);

    const updated = await store.update(created._id, {
      ...object,
      name: 'Item xxxx yyyy',
    });

    expect(updated.name).toEqual('Item xxxx yyyy');
  });

  it('get -- should get an Object by id', async () => {
    const object = createObject();
    const { id } = await store.create(object);
    const { name, translation } = await store.get(id);

    expect(id).toBeDefined();
    expect(name).toEqual(object.name);
    expect(translation[0].name).toEqual(object.translation[0].name);
  });

  it('findByIdOrSlug -- should get an Object by id or slug', async () => {
    const object = createObject();
    const { id, slug } = await store.create(object);
    const { name, translation } = await store.findByIdOrSlug(slug);

    expect(id).toBeDefined();
    expect(slug).toBeDefined();

    expect(name).toEqual(object.name);
    expect(translation[0].name).toEqual(object.translation[0].name);

    const {
      name: name2,
      translation: translation2,
    } = await store.findByIdOrSlug(id);

    expect(name2).toEqual(object.name);
    expect(translation2[0].name).toEqual(object.translation[0].name);
  });

  it('delete -- should mark an Object as deleted and draftde', async () => {
    const { id } = await store.create(
      createObject({ name: 'Random Object Name XYZ' })
    );
    await store.delete(id);

    const { deletedAt, draft } = await store.get(id);

    expect(id).toBeDefined();
    expect(draft).toBeTruthy();
    expect(deletedAt).toBeDefined();
  });

  it('delete(hard=true) -- should permanently delete an Object', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const { id } = await store.create(createObject());
    await store.delete(id, { hard: true });

    const doc = await store.get(id);

    expect(doc).toBeNull();
  });

  it('restore -- should mark an Object as not deleted and published', async () => {
    await ConnectedObject.deleteMany({}).exec();
    const { id } = await store.create(createObject());
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

  it('publish -- should undraft an Object', async () => {
    const object = createObject();
    const { id } = await store.create({ ...object, draft: false });

    await store.publish(id);

    const { draft } = await store.get(id);
    expect(draft).toBeFalsy();
  });

  it('unpublish -- should mark an Object as draft', async () => {
    const object = createObject();
    const { id } = await store.create({ ...object, draft: true });

    await store.unpublish(id);

    const { draft } = await store.get(id);

    expect(draft).toBeTruthy();
  });

  it('find -- should return objects for the given condition', async () => {
    await ConnectedObject.deleteMany({}).exec();
    await store.create(createObject({ name: 'Pebble' }));
    await store.create(createObject({ name: 'Pebble Time' }));

    const { itemCount } = await store.find({ name: 'Pebble' });
    expect(itemCount).toEqual(1);
  });

  it('find -- with regex should return all objects for the given condition', async () => {
    await ConnectedObject.deleteMany({}).exec();
    await store.create(createObject({ name: 'Rocket Book' }));
    await store.create(createObject({ name: 'Mini Rocket Book' }));

    const { itemCount } = await store.find({
      $or: [{ name: /Rocket$/ }, { name: /^Rocket/ }],
    });

    expect(itemCount).toEqual(1);
  });

  // it('find -- with $text search should Object for the given condition', async () => {
  //   await ConnectedObject.deleteMany({}).exec();
  //   await store.create(createObject({ name: 'Smart Scale' }));
  //   await store.create(createObject({ name: 'Smart Oven' }));

  //   const { itemCount } = await store.find(
  //     { $text: { $search: '"smart"' } },
  //     {
  //       select: { score: { $meta: 'textScore' } },
  //       sort: { score: { $meta: 'textScore' } },
  //     }
  //   );

  //   expect(itemCount).toEqual(2);
  // });
});
