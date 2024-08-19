export function createThemeObject(override = {}) {
  return {
    language: 'fr',
    translation: [
      {
        language: 'en',
        name: 'Nutrition',
        subThemes: [
          'Have a varied diet (dairy products, bread and cereal, fruit/vegetables, meat and substitutes)',
          "Have balanced portions (as recommended by Canada's Food Guide)",
          'Write the grocery list',
          'Choose the food needed to prepare the meals',
          'Identify spoiled food items and discard them',
          'Prepare simple meals (sandwich, cereal, salad)',
          'Prepare complete meals (soup, salad, main dish)',
          'Use the knobs/buttons to turn on the stove burners or the oven',
          'Warm up a meal in the microwave oven',
          '. Use small household appliances (kettle, toaster, mixer)',
          'Other tasks related to nutrition and meal preparation',
        ],
      },
    ],
    name: 'Alimentation',
    subThemes: [
      'Avoir une alimentation variée (produits laitiers, pains et céréales, fruits/légumes, viande et substituts)',
      'Avoir des portions équilibrées (selon les recommandations du Guide alimentaire canadien)',
      'Avoir des portions équilibrées (selon les recommandations du Guide alimentaire canadien)',
      'Faire la liste d’épicerie',
      'Choisir les aliments pour la préparation des repas',
      'Identifier les aliments avariés et les jeter',
      'Préparer des repas simples (sandwich, céréales, salade)',
      'Préparer des repas complets (soupe, salade, met principal)',
      'Utiliser les boutons d’une cuisinière pour allumer les ronds ou le four',
      'Réchauffer un repas avec l’aide du four à micro-ondes',
      '. Utiliser des petits appareils électroménagers (bouilloire, grille-pain, mélangeur)',
      'Autres tâches en lien avec l’alimentation et la préparation des repas',
    ],
    ...override,
  };
}

export function createThemesForSearch() {
  return [
    {
      language: 'fr',
      translation: [
        {
          language: 'en',
          name: 'Nutrition',
          subThemes: [
            'Have a varied diet (dairy products, bread and cereal, fruit/vegetables, meat and substitutes)',
            "Have balanced portions (as recommended by Canada's Food Guide)",
            'Write the grocery list',
            'Choose the food needed to prepare the meals',
            'Identify spoiled food items and discard them',
            'Prepare simple meals (sandwich, cereal, salad)',
            'Prepare complete meals (soup, salad, main dish)',
            'Use the knobs/buttons to turn on the stove burners or the oven',
            'Warm up a meal in the microwave oven',
            '. Use small household appliances (kettle, toaster, mixer)',
            'Other tasks related to nutrition and meal preparation',
          ],
        },
      ],
      name: 'Alimentation',
      subThemes: [
        'Avoir une alimentation variée (produits laitiers, pains et céréales, fruits/légumes, viande et substituts)',
        'Avoir des portions équilibrées (selon les recommandations du Guide alimentaire canadien)',
        'Avoir des portions équilibrées (selon les recommandations du Guide alimentaire canadien)',
        'Faire la liste d’épicerie',
        'Choisir les aliments pour la préparation des repas',
        'Identifier les aliments avariés et les jeter',
        'Préparer des repas simples (sandwich, céréales, salade)',
        'Préparer des repas complets (soupe, salade, met principal)',
        'Utiliser les boutons d’une cuisinière pour allumer les ronds ou le four',
        'Réchauffer un repas avec l’aide du four à micro-ondes',
        '. Utiliser des petits appareils électroménagers (bouilloire, grille-pain, mélangeur)',
        'Autres tâches en lien avec l’alimentation et la préparation des repas',
      ],
    },
    {
      createdAt: '2019-03-12T06:30:39.680Z',
      publishedAt: '2019-03-12T06:30:39.680Z',
      updatedAt: null,
      deletedAt: null,
      draft: false,
      language: 'fr',
      translation: [
        {
          language: 'en',
          name: 'Housekeeping',
          subThemes: [
            'Maintain the inside of the home (housecleaning, laundry, changing a light bulb)',
            'Empty the trash cans and take out the garbage',
            'Do spring-cleaning (windows, walls)',
            'Maintain the yard (grass, snow, leaves)',
            'Other tasks related to home and housekeeping',
          ],
        },
      ],
      name: 'Entretien ménager',
      subThemes: [
        'Entretenir l’intérieur du domicile (ménage, lavage, changer une ampoule)',
        'Vider les poubelles et sortir les ordures',
        'Faire le grand ménage saisonnier (vitres, murs)',
        'Entretenir l’extérieur du domicile (gazon, neige, feuilles)',
        'Autres tâches en lien avec l’habitation et l’entretien ménager',
      ],
    },
    {
      createdAt: '2019-03-12T06:30:39.680Z',
      publishedAt: '2019-03-12T06:30:39.680Z',
      updatedAt: null,
      deletedAt: null,
      draft: false,
      language: 'fr',
      translation: [
        {
          language: 'en',
          name: 'Budget',
          subThemes: [
            'Plan a budget',
            'Pay the bills (rent, telephone, cable, electricity)',
            'Other tasks related to managing the budget and responsibilities',
          ],
        },
      ],
      name: 'Budget',
      subThemes: [
        'Planifier un budget',
        'Payer les comptes (loyer, téléphone, câblodistribution, électricité)',
        'Autres tâches en lien avec la gestion du budget',
      ],
    },
    {
      createdAt: '2019-03-12T06:30:39.680Z',
      publishedAt: '2019-03-12T06:30:39.680Z',
      updatedAt: null,
      deletedAt: null,
      draft: false,
      language: 'fr',
      translation: [
        {
          language: 'en',
          name: 'Clothing',
          subThemes: [
            'Choose clothes whose colours go well together',
            'Choose clothes that are appropriate for the weather and the circumstances',
            'Do laundry (e.g., sort clothes, use washer and dryer)',
            'Fold and put away your clothes',
            'Other clothes-related tasks',
          ],
        },
      ],
      name: 'Habillement',
      subThemes: [
        'Choisir des vêtements dont les couleurs et les styles s’harmonisent',
        'Choisir des vêtements appropriés selon la température et les circonstances',
        'Faire la lessive (p. ex., trier les vêtements, utiliser une laveuse et une sécheuse)',
        'Plier et ranger ses vêtements',
        'Autres tâches en lien avec habillement et entretien des vêtements',
      ],
    },
  ];
}
