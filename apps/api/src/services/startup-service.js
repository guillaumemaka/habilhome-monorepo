import { ADMIN_SCOPE, PUBLIC_SCOPE } from '../models/mongo/setting';

export const defaultConfigurations = [
  {
    section: 'general',
    fields: [
      {
        scope: [ADMIN_SCOPE],
        required: true,
        label: 'Email pour les notifications, alert, contact',
        name: 'email',
        value: 'domotique.uqtr@gmail.com',
        valueType: 'string',
        description:
          'Cette adresse sera utilisée pour envoyer toute notification, alert, formulaire de contact. etc...',
      },
      {
        scope: [PUBLIC_SCOPE],
        required: true,
        label: 'URL du Questionnaire Survey Monkey',
        name: 'surveyMonkeyUrl',
        value: 'https://fr.surveymonkey.com/r/9DGHZGY',
        valueType: 'url',
        description: 'Définit le questionnaire de satisfaction en cours',
      },
      {
        scope: [PUBLIC_SCOPE],
        required: true,
        label: 'URL du Questionnaire Survey Monkey (Anglais)',
        name: 'surveyMonkeyUrlEn',
        value: 'https://fr.surveymonkey.com/r/KZJYFR9',
        valueType: 'url',
        description:
          'Définit le questionnaire de satisfaction en cours (Version Anglaise)',
      },
      {
        scope: [PUBLIC_SCOPE],
        required: false,
        label: 'Activer le questionnaire',
        name: 'surveyIsActive',
        value: false,
        valueType: 'Boolean',
        description: 'Active ou désactive le questionnaire de satisfaction',
      },
    ],
  },
];

export default class StartupService {
  constructor({ configurationService, logger }) {
    this.configurationService = configurationService;
    this.logger = logger;
  }

  async init() {
    await this.initializeConfiguration();
  }

  async initializeConfiguration() {
    this.logger.info(`Initializing default configuration...`);

    for (const config of defaultConfigurations) {
      for (const field of config.fields) {
        const created = await this.configurationService.createOrUpdateIfNotExist(
          config.section,
          field.name,
          field
        );
        if (created) {
          this.logger.info(
            `Missing configuration field '${field.name}' in section '${config.section}' has been initialized [CREATED]`
          );
        } else {
          this.logger.info(
            `Configuration field '${field.name}' in section '${config.section}' already exist! [SKIPPED]`
          );
        }
      }
    }
  }
}
