export function createApplicationObject(override = {}) {
  return {
    language: 'fr',
    links: [{ title: 'android', url: 'Non disponible' }],
    lang: ['fr', 'en'],
    translation: [
      {
        links: [{ title: 'android', url: 'Not available' }],
        language: 'en',
        themes: ['Clothing'],
        subThemes: [
          'Choose clothes that are appropriate for the weather and the circumstances',
        ],
        name: 'Brella - Personal Weather',
        companyName: 'Matt Barker & Austin Astorga',
        description:
          'Brella - Personal Wethear is an app that allows you to know the temperature of the day and what to wear according to the temperature and planned activities.',
        requiredAbilities:
          "To use this application, the user must be able to:\r\n-Read to adjust the parameters according to his perception of temperature and to read the app's message indicating what to wear",
        price: {
          low: 0,
          high: 0,
          currency: null,
          free: false,
          variable: true,
          inAppPurchased: false,
          fixedPrice: false,
        },
        restrictions: 'Apple : iOS 10.0 or later',
        comment:
          'The app seems very practical and easy to use. Very personalized application that answers very well to the question "How should I dress according to the temperature? Visual comparison of the temperature for the following days. Screen suitable for iPhone, but very visible on iPad.',
      },
    ],
    translated: true,
    draft: false,
    favorite: true,
    createdAt: new Date(1552194219853),
    publishedAt: new Date(1552194219853),
    updatedAt: null,
    deletedAt: null,
    themes: ['Habillement'],
    subThemes: [
      'Choisir des vêtements appropriés selon la température et les circonstances',
    ],
    name: 'Brella - Personal Weather',
    companyName: 'Matt Barker & Austin Astorga',
    imageUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple118/v4/bc/d6/53/bcd653e4-3388-0873-496c-efecbcae57fa/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-7.png/9000x9000.png',
    description:
      'Brella - Personal Wethear est une application permettant de connaître la température de la journée et de savoir quoi porter selon la température et des programmations personnelles.',
    requiredAbilities:
      "Pour utiliser cette application, l'utilisateur doit être en mesure de :\r\n-Lire pour ajuster les paramètres selon sa perception de la température et pour lire le message de l'application indiquant quoi porter",
    price: { type: 'text', value: 'Gratuite avec achats intégrés' },
    deviceRestrictions: 'Apple : nécessite iOS 10.0 minimum',
    comment:
      'L\'application semble très pratique et simple à utiliser. Application très personnalisée qui répond très bien à la question "Comment dois-je m\'habiller en fonction de la température?". Comparaison visuelle de la température pour les journées suivantes. Écran adapter au iPhone, mais très bien visible sur iPad.',
    __v: 0,
    kind: 'Application',
    ...override,
  };
}
