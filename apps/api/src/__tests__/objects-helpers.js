export function createObject(override = {}) {
  return {
    language: 'fr',
    links: [],
    lang: [],
    translation: [
      {
        links: [],
        language: 'en',
        themes: ['Clothing'],
        subThemes: [
          'Do the laundry (e.g., sort clothes, use washer and dryer)',
        ],
        name: 'Styler',
        companyName: 'LG',
        description:
          'This connected object eliminates folds of clothing and heal their appearance. It also helps reduce odors and sanitize those with delicate fabrics and toys. Connected to a mobile device, it is possible to remotely: start and monitor the cycle; know when it ends; download new cycles, solve minor problems with intelligent diagnosis and check energy consumption. In addition, this item can be used with the Google Assistant for voice commands.',
        complementaryDevice: 'N/A',
        os:
          'Androïd and Apple. The versions of the operating system vary according to the devices of the companies.',
        websiteLink: 'https://www.lg.com/ca_fr/salledelavageultime/lg-S3RFBN',
        precision: 'N/A',
      },
    ],
    translated: true,
    draft: false,
    favorite: false,
    createdAt: 1552193936944,
    publishedAt: 1552193936944,
    updatedAt: null,
    deletedAt: null,
    themes: ['Habillement'],
    subThemes: [
      'Faire la lessive (p. ex., trier les vêtements, utiliser une laveuse et une sécheuse)',
    ],
    name: 'Styler',
    companyName: 'LG',
    imageLink:
      'https://cdn.mos.cms.futurecdn.net/850c5f4e328f1af1a7e438e53e1ca71e-768-80.jpg',
    description:
      "Cet objet connecté permet d'éliminer les plis des vêtements et soigner leur apparence. Il permet également de réduire les odeurs et d'aseptiser ceux aux tissus délicats et les jouets. Connectée à un appareil mobile, il est possible à distance de : démarrer et surveiller le cycle; savoir quand il se termine; télécharger de nouveaux cycles, réglez des problèmes mineurs avec le diagnostic intelligent et vérifier la consommation d’énergie. De plus, cet objet peut être utilisé avec l'assistant Google pour des commandes vocales.",
    price: {
      low: 0,
      high: 0,
      currency: null,
      free: false,
      variable: true,
      inAppPurchased: false,
      fixedPrice: false,
    },
    additionalDeviceNeeded: 'Téléphone intelligent et/ou tablette',
    complementaryDevice: 'N/A',
    os:
      "AndroÏd et Apple. Les versions du système d'exploitation varies selon les appareils des compagnies",
    mobileAppNeeded: 'LG SmartThinQ',
    websiteLink: 'https://www.lg.com/ca_fr/salledelavageultime/lg-S3RFBN',
    precision: 'N/A',
    ...override,
  };
}
