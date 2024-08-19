import * as Utils from '../lib/utils';

export default class SearchService {
  constructor({ logger, abstractModelStore, lang }) {
    this.logger = logger;
    this.store = abstractModelStore;
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
      select: { score: { $meta: 'textScore' } },
      sort: { score: { $meta: 'textScore' }, ...Utils.transformSort(sort) },
      page,
      limit,
    };

    return this.store.find(conditions, opts);
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
          $match: {
            name: regex,
          },
        },
        {
          $project: {
            language: 1,
            name: 1,
            slug: 1,
            imageUrl: 1,
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
              imageUrl: '$imageUrl',
              name: '$translation.name',
              slug: '$translation.slug',
              language: '$translation.language',
            },
          },
        },
        {
          $match: {
            name: regex,
          },
        },
        {
          $project: {
            name: 1,
            language: 1,
            slug: 1,
            imageUrl: 1,
          },
        },
      ];
    }

    query.push({
      $addFields: {
        kind: 'support',
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

    return this.store.aggregate(query);
  }
}
