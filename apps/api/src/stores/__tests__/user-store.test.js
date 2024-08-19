import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { Types } from 'mongoose';

let container;
let store;

describe('UserStore', () => {
  beforeAll(() => {
    container = configureContainer();
    store = container.cradle.userStore;
  });

  it('container -- should be available in container', () => {
    expect(container.has('userStore')).toBeTruthy();
    expect(store).toBeDefined();
  });

  it('create -- should create a user', async () => {
    const user = await store.create({
      email: 'person41@example.com',
      password: 'P@ssw0rd',
    });

    expect(user.isNew).toBeFalsy();
    expect(user.email).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.checkPassword('P@ssw0rd')).toBeTruthy();
  });

  it('get -- should get a user by id', async () => {
    const { id } = await store.create({
      email: 'person42@example.com',
      password: 'P@ssw0rd',
    });
    const user = await store.get(id);

    expect(user.email).toEqual('person42@example.com');
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.checkPassword('P@ssw0rd')).toBeTruthy();
  });

  it('delete -- should delete a user by id', async () => {
    const id = new Types.ObjectId();

    await store.create({
      _id: id,
      email: 'person43@example.com',
      password: 'P@ssw0rd',
    });
    await store.delete(id);

    const user = await store.get(id);

    expect(user.deletedAt).not.toBeNull();
  });

  it('find -- should return a list of user', async () => {
    await store.create({
      email: 'person_1000@example.com',
      password: 'P@ssw0rd',
    });
    const users = await store.find({ email: 'person_1000@example.com' });
    expect(users.itemCount).toBe(1);
  });
});
