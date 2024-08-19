import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import User from '../../models/mongo/user';

let container;
let service;

describe('AuthService', () => {
  beforeAll(async (done) => {
    await User.deleteMany({});
    container = configureContainer();
    service = container.cradle.authService;
    return done();
  });

  it('container -- should be available in container', () => {
    expect(container.has('authService')).toBeTruthy();
    expect(service).toBeDefined();
  });

  it('loadUserByEmail -- should return the user for the given email', async (done) => {
    await container.cradle.userStore.create({
      email: 'person@example.com',
      password: 'P@ssw0rd',
    });
    const user = await service.loadUserByEmail('person@example.com');
    expect(user).toBeDefined();
    return done();
  });
});
