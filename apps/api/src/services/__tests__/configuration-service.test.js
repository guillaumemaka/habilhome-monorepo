import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { SettingModel } from '../../models/mongo';
import { ADMIN_SCOPE, PUBLIC_SCOPE } from '../../models/mongo/setting';

let container;
let service;

describe('ConfigurationService', () => {
  beforeAll(async (done) => {
    await SettingModel.deleteMany({});
    container = configureContainer();
    service = container.cradle.configurationService;
    return done();
  });

  it('configurationService -- should be available in container', () => {
    expect(container.has('configurationService')).toBeTruthy();
    expect(service).toBeDefined();
  });

  it('createOrUpdate() -- should create a new section entry configuration', async (done) => {
    const configValue = {
      label: 'email',
      name: 'email',
      value: 'user@example.com',
      valueType: 'email',
      description: 'user email address',
      required: true,
      scope: [ADMIN_SCOPE],
    };

    const config = await service.createOrUpdate(
      'general',
      'email',
      configValue
    );
    expect(config).not.toBeNull();
    expect(config.fields.length).toBe(1);
    const { _id, ...rest } = config.fields[0];
    expect(_id).toBeDefined();
    expect(config.section).toBe('general');
    expect(rest).toStrictEqual(configValue);
    return done();
  });

  it('createOrUpdate() -- should update a section entry configuration', async (done) => {
    const configValue = {
      label: 'Email Address',
      name: 'emailAddress',
      value: 'user1@example.com',
      valueType: 'email',
      description: 'user email address',
      required: true,
      scope: [ADMIN_SCOPE, PUBLIC_SCOPE],
    };

    const config = await service.createOrUpdate(
      'general',
      'email',
      configValue
    );

    expect(config).not.toBeNull();
    expect(config.fields.length).toBe(1);
    expect(config.section).toBe('general');
    const { _id, ...rest } = config.fields[0];
    expect(_id).toBeDefined();
    expect(config.section).toBe('general');
    expect(rest).toStrictEqual(configValue);
    return done();
  });

  it('createOrUpdate() -- should update a section entry configuration partially', async (done) => {
    const partialValue = {
      value: 'user2@example.com',
      valueType: 'email',
      scope: [ADMIN_SCOPE],
    };

    const config = await service.createOrUpdate(
      'general',
      'emailAddress',
      partialValue
    );

    expect(config).not.toBeNull();
    expect(config.fields.length).toBe(1);
    expect(config.section).toBe('general');
    const { _id, ...rest } = config.fields[0];
    expect(_id).toBeDefined();
    expect(config.section).toBe('general');
    expect(rest).toStrictEqual({ ...rest, ...partialValue });
    return done();
  });

  it('createOrUpdate() -- should create a new field in an existing section entry configuration', async (done) => {
    const configValue = {
      label: 'Survey URL (fr)',
      name: 'surveyUrlFr',
      value: 'http://example.com/fr/survey/1',
      valueType: 'url',
      description: 'Survey URL in french',
      required: true,
      scope: [PUBLIC_SCOPE],
    };

    const config = await service.createOrUpdate(
      'general',
      'surveyUrlFr',
      configValue
    );
    expect(config).not.toBeNull();
    expect(config.fields.length).toBe(2);
    const { _id, ...rest } = config.fields[1];
    expect(_id).toBeDefined();
    expect(config.section).toBe('general');
    expect(rest).toStrictEqual(configValue);
    return done();
  });

  it('createOrUpdateIfNotExist() -- should not create neither update an existing field in an existing section entry configuration', async (done) => {
    const configValue = {
      label: 'Survey URL (fr)',
      name: 'surveyUrlFr',
      value: 'http://example.com/en/survey/1',
      valueType: 'url',
      description: 'Survey URL in french',
      required: true,
      scope: [PUBLIC_SCOPE],
    };

    const config = await service.createOrUpdateIfNotExist(
      'general',
      'surveyUrlFr',
      configValue
    );
    expect(config).toBeNull();

    const field = await service.getField('general', 'surveyUrlFr');
    const { _id, ...rest } = field;
    expect(_id).toBeDefined();
    expect(rest).not.toStrictEqual(configValue);
    return done();
  });

  it('getField() -- should get an existing field in an existing section entry configuration', async (done) => {
    const configValue = {
      label: 'Survey URL (fr)',
      name: 'surveyUrlFr',
      value: 'http://example.com/fr/survey/1',
      valueType: 'url',
      description: 'Survey URL in french',
      required: true,
      scope: [PUBLIC_SCOPE],
    };

    const field = await service.getField('general', 'surveyUrlFr');
    expect(field).not.toBeNull();

    const { _id, ...rest } = field;
    expect(_id).toBeDefined();
    expect(rest).toStrictEqual(configValue);
    return done();
  });

  it('getSection([ADMIN_SCOPE, PUBLIC_SCOPE]) -- should get given scoped configurations', async (done) => {
    const config = await service.getSection('general', [
      ADMIN_SCOPE,
      PUBLIC_SCOPE,
    ]);
    expect(config).toBeDefined();
    expect(config.section).toBe('general');
    expect(config.fields.length).toBe(2);
    expect(config.fields[0].name).toBe('emailAddress');
    expect(config.fields[1].name).toBe('surveyUrlFr');

    return done();
  });

  it('all([ADMIN_SCOPE, PUBLIC_SCOPE]) -- should get given scoped configurations', async (done) => {
    const configs = await service.all([ADMIN_SCOPE, PUBLIC_SCOPE]);
    expect(configs.length).toBe(1);
    expect(configs[0].section).toBe('general');
    expect(configs[0].fields.length).toBe(2);
    expect(configs[0].fields[0].name).toBe('emailAddress');
    expect(configs[0].fields[1].name).toBe('surveyUrlFr');

    return done();
  });

  it('all() -- should all admin scoped configurations by default', async (done) => {
    const configs = await service.all();
    expect(configs.length).toBe(1);
    expect(configs[0].section).toBe('general');
    expect(configs[0].fields.length).toBe(1);
    expect(configs[0].fields[0].name).toBe('emailAddress');

    return done();
  });
});
