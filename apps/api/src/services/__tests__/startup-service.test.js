import '../../__tests__/api-helper';
import { configureContainer } from '../../lib/container';
import { SettingModel } from '../../models/mongo';
import { defaultConfigurations } from '../startup-service';
import { ADMIN_SCOPE, PUBLIC_SCOPE } from '../../models/mongo/setting';

let container;
let startupService;
let configurationService;

describe('ConfigurationService', () => {
  beforeAll(async (done) => {
    await SettingModel.deleteMany({});
    container = configureContainer();
    startupService = container.cradle.startupService;
    configurationService = container.cradle.configurationService;
    return done();
  });

  it('startupService -- should be available in container', () => {
    expect(container.has('configurationService')).toBeTruthy();
    expect(container.has('startupService')).toBeTruthy();
    expect(startupService).toBeDefined();
  });

  it('init() -- should initialize default configuration', async (done) => {
    await startupService.init();

    for (const config of defaultConfigurations) {
      const configGet = await configurationService.getSection('general', [
        ADMIN_SCOPE,
        PUBLIC_SCOPE,
      ]);
      expect(configGet).not.toBeNull();
      expect(configGet.section).toBe(config.section);
      expect(configGet.fields.length).toBe(config.fields.length);

      for (const defaultField of config.fields) {
        const { _id, ...rest } = configGet.fields.find(
          (f) => f.name === defaultField.name
        );
        expect(_id).toBeDefined();
        expect(rest).toStrictEqual(defaultField);
      }
    }
    return done();
  });
});
