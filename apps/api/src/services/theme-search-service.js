export default class SearchService {
  constructor({ logger, themeStore, lang }) {
    this.logger = logger;
    this.themeStore = themeStore;
    this.lang = lang;
  }

  search(q, { limit, page, sort, withDraft, withTrash }) {
    // const terms = q.replace('+', ' ');
    const regex = new RegExp(q, 'i');

    const conditions = {
      // $text: { $search: terms, $language: this.lang },
      $or: [{ subThemes: regex }, { translation: { subThemes: regex } }],
      deletedAt: null,
      draft: false,
    };

    if (withDraft) {
      delete conditions['draft'];
    }

    if (withTrash) {
      delete conditions['deletedAt'];
    }

    const opts = {
      // select: { score: { $meta: 'textScore' } },
      sort, //: { score: { $meta: 'textScore' }, ...Utils.transformSort(sort) },
      page,
      limit,
    };

    this.logger.debug({ conditions, opts });

    return this.themeStore.find(conditions, opts);
  }

  aggregate(term, page = 1, limit = 25) {
    let query = [];
    const regex = new RegExp(term, 'i');

    if (this.lang === 'fr') {
      query = [
        {
          $match: {
            deletedAt: null,
            draft: false,
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              original: '$subThemes',
              name: '$name',
              subTheme: '$subThemes',
              language: '$language',
              slug: '$slug',
              rootLangSubThemes: { $arrayElemAt: ['$translation', 0] },
            },
          },
        },
        {
          $unwind: {
            path: '$subTheme',
          },
        },
        {
          $match: {
            $or: [{ name: { $in: [regex] } }, { subTheme: regex }],
          },
        },
        {
          $project: {
            fr: {
              subTheme: '$subTheme',
              language: '$language',
              slug: '$slug',
              name: '$name',
            },
            en: {
              subTheme: {
                $arrayElemAt: [
                  '$rootLangSubThemes.subThemes',
                  {
                    $indexOfArray: ['$original', '$subTheme'],
                  },
                ],
              },
              language: '$rootLangSubThemes.language',
              slug: '$rootLangSubThemes.slug',
              name: '$rootLangSubThemes.name',
            },
          },
        },
      ];
    } else {
      query = [
        {
          $match: {
            deletedAt: null,
            draft: false,
          },
        },
        {
          $unwind: {
            path: '$translation',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              original: '$translation.subThemes',
              name: '$translation.name',
              language: '$translation.language',
              slug: '$translation.slug',
              subTheme: '$translation.subThemes',
              rootLangSubThemes: {
                language: '$language',
                subThemes: '$subThemes',
                slug: '$slug',
                name: '$name',
              },
            },
          },
        },
        {
          $unwind: {
            path: '$subTheme',
          },
        },
        {
          $match: {
            $or: [{ name: { $in: [regex] } }, { subTheme: regex }],
          },
        },
        {
          $project: {
            en: {
              subTheme: '$subTheme',
              language: '$language',
              slug: '$slug',
              name: '$name',
            },
            fr: {
              subTheme: {
                $arrayElemAt: [
                  '$rootLangSubThemes.subThemes',
                  {
                    $indexOfArray: ['$original', '$subTheme'],
                  },
                ],
              },
              language: '$rootLangSubThemes.language',
              slug: '$rootLangSubThemes.slug',
              name: '$rootLangSubThemes.name',
            },
          },
        },
      ];
    }

    query.push({
      $addFields: {
        kind: 'task',
      },
    });

    query.push({
      $facet: {
        metadata: [
          { $count: 'itemCount' },
          {
            $addFields: {
              currentPage: { $ceil: { $divide: [page, limit] } },
              perPage: limit,
              pageCount: { $ceil: { $divide: ['$itemCount', limit] } },
              next: {
                $cond: [
                  {
                    $gt: [
                      {
                        $multiply: [
                          {
                            $subtract: [{ $add: ['$currentPage', 1] }, 1],
                          },
                          '$itemCount',
                        ],
                      },
                      1,
                    ],
                  },
                  { $add: ['$currentPage', 1] },
                  false,
                ],
              },
              prev: {
                $cond: [
                  { $gt: ['$currentPage', 1] },
                  { $subtract: ['$currentPage', 1] },
                  false,
                ],
              },
            },
          },
        ],
        results: [
          { $skip: (page === 0 ? 1 : page - 1) * limit },
          { $limit: limit },
        ],
      },
    });

    query.push({
      $project: {
        itemCount: { $arrayElemAt: ['$metadata.itemCount', 0] },
        currentPage: { $arrayElemAt: ['$metadata.currentPage', 0] },
        perPage: { $arrayElemAt: ['$metadata.perPage', 0] },
        totalPages: { $arrayElemAt: ['$metadata.totalPages', 0] },
        next: { $arrayElemAt: ['$metadata.next', 0] },
        prev: { $arrayElemAt: ['$metadata.prev', 0] },
        results: 1,
      },
    });

    this.logger.debug({ query, lang: this.lang });

    return this.themeStore.aggregate(query);
  }
}
