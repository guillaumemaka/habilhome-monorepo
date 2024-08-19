export default class SearchService {
  constructor({ logger, objectStore, lang }) {
    this.logger = logger;
    this.objectStore = objectStore;
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

    if (withDraft) {
      conditions.draft = { $eq: true };
    }

    if (withTrash) {
      conditions.deletedAt = { $ne: null };
    }

    const opts = {
      // select: { score: { $meta: 'textScore' } },
      // sort: { score: { $meta: 'textScore' }, ...Utils.transformSort(sort) },
      page,
      limit,
      sort,
    };
    return this.objectStore.find(conditions, opts);
  }
}
