import { DomainModel } from '../models/mongo/abstract_model';
import Theme from '../models/mongo/theme';
import bluebird from 'bluebird';
import { merge } from 'lodash';

export default class StatsService {
  async getStats() {
    const [domainStats, themesStats] = await bluebird.all([
      this.getDomainModelStats(),
      this.getThemeStats(),
    ]);

    return bluebird.resolve(merge(domainStats[0], themesStats[0]));
  }

  getThemeStats() {
    return Theme.aggregate([
      {
        $match: {
          name: {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          drafted: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$draft', true],
                },
                then: 1,
                else: 0,
              },
            },
          },
          published: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$draft', false],
                },
                then: 1,
                else: 0,
              },
            },
          },
          trashed: {
            $sum: {
              $cond: {
                if: {
                  $ne: ['$deletedAt', null],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          theme: {
            total: '$total',
            drafted: '$drafted',
            published: '$published',
            trashed: '$trashed',
          },
        },
      },
    ]).exec();
  }

  getDomainModelStats() {
    return DomainModel.aggregate([
      {
        $facet: {
          total: [
            {
              $match: {
                kind: {
                  $exists: true,
                },
                createdAt: {
                  $exists: true,
                },
              },
            },
            {
              $bucket: {
                groupBy: '$kind',
                boundaries: ['Application', 'ConnectedObject'],
                default: 'ConnectedObject',
                output: {
                  count: {
                    $sum: 1,
                  },
                },
              },
            },
          ],
          deleted: [
            {
              $group: {
                _id: null,
                application: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $gt: ['$deletedAt', null],
                          },
                          {
                            $eq: ['$kind', 'Application'],
                          },
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                object: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $gt: ['$deletedAt', null],
                          },
                          {
                            $eq: ['$kind', 'ConnectedObject'],
                          },
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          ],
          drafted: [
            {
              $group: {
                _id: null,
                application: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $eq: ['$draft', true],
                          },
                          {
                            $eq: ['$kind', 'Application'],
                          },
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                object: {
                  $sum: {
                    $cond: {
                      if: {
                        $and: [
                          {
                            $eq: ['$draft', true],
                          },
                          {
                            $eq: ['$kind', 'ConnectedObject'],
                          },
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          'published.application': {
            $subtract: [
              {
                $arrayElemAt: ['$total.count', 0],
              },
              {
                $arrayElemAt: ['$deleted.application', 0],
              },
            ],
          },
          'published.object': {
            $subtract: [
              {
                $arrayElemAt: ['$total.count', 1],
              },
              {
                $arrayElemAt: ['$deleted.object', 0],
              },
            ],
          },
        },
      },
      {
        $project: {
          application: {
            total: {
              $arrayElemAt: ['$total.count', 0],
            },
            trashed: {
              $arrayElemAt: ['$deleted.application', 0],
            },
            drafted: {
              $arrayElemAt: ['$drafted.application', 0],
            },
            published: '$published.application',
          },
          object: {
            total: {
              $arrayElemAt: ['$total.count', 1],
            },
            trashed: {
              $arrayElemAt: ['$deleted.object', 0],
            },
            drafted: {
              $arrayElemAt: ['$drafted.object', 0],
            },
            published: '$published.object',
          },
        },
      },
    ]).exec();
  }
}
