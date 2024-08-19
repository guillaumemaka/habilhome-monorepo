export default class SearchService {
  constructor({ logger, applicationStore, lang }) {
    this.logger = logger;
    this.applicationStore = applicationStore;
    this.lang = lang;
  }

  search(q, { limit, page, sort, withDraft, withTrash }) {
    // const terms = _.words(q)
    // .map(t => `"${t}"`)
    // .join(' ')

    const conditions = {
      // $text: { $search: `'${q}'`, $language: 'none' },
      $or: [
        { name: { $regex: `${q}$`, $options: 'i' } },
        { name: { $regex: `^${q}`, $options: 'i' } },
        { 'translation.name': { $regex: `${q}$`, $options: 'i' } },
        { 'translation.name': { $regex: `^${q}`, $options: 'i' } },
      ],
      deletedAt: { $eq: null },
      draft: false,
    };

    if (withDraft != undefined) {
      conditions.draft = { $eq: true };
    }

    if (withTrash != undefined) {
      conditions.deletedAt = { $ne: null };
    }

    const opts = {
      // select: { score: { $meta: 'textScore' } },
      // sort: { score: { $meta: 'textScore' }, ...Utils.transformSort(sort) },
      page,
      limit,
      sort,
    };
    return this.applicationStore.find(conditions, opts);
  }
}
