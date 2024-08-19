import { route, GET, POST, PUT, DELETE, before } from 'awilix-koa';
import passport from 'koa-passport';
import { v } from '../lib/validations/search-validations';
import validate from 'koa2-validation';
import * as Utils from '../lib/utils';
import koaBody from 'koa-bodyparser';
import { createS3Storage, s3 } from '../lib/storage/s3';
import slug from 'slug';
import { logger } from '../lib/logger';
import sharp from 'sharp';

function toTransform(sizes) {
  return sizes.map((s) => {
    return {
      id: s.suffix,
      key: (req, file, cb) => {
        logger.debug('req.body', { data: req.body });
        try {
          const key = `${slug(req.body.name, { lower: true })}--${
            s.suffix
          }.jpg`;
          cb(null, key);
        } catch (err) {
          logger.error(err);
          cb(err);
        }
      },
      transform: (req, file, cb) => {
        try {
          if (s.suffix === 'original') {
            cb(null, sharp().jpeg());
          } else {
            cb(null, sharp().resize(s.width, s.height).jpeg());
          }
        } catch (error) {
          logger.error(error);
          cb(error);
        }
      },
    };
  });
}

const sizes = [
  { suffix: 'xlg', width: 1200, height: 1200 },
  { suffix: 'lg', width: 800, height: 800 },
  { suffix: 'md', width: 500, height: 500 },
  { suffix: 'sm', width: 300, height: 300 },
  { suffix: 'xs', width: 100 },
  { suffix: 'original' },
];

const upload = createS3Storage({
  acl: 'public-read',
  key: undefined,
  shouldTransform: function (req, file, cb) {
    cb(null, file && /^image/i.test(file.mimetype));
  },
  transforms: toTransform(sizes),
});

function setIconIfPresent(ctx, theme) {
  logger.debug({ theme });
  if (ctx.file && ctx.file.transforms && ctx.file.transforms.length > 0) {
    theme.icon = ctx.file.transforms.reduce(
      (acc, { id, location, metadata, contentType }) => {
        acc[id] = { metadata, location, contentType };
        return acc;
      },
      {}
    );

    if (!theme._metadata) {
      theme._metadata = {};
    }

    theme._metadata.s3 = ctx.file.transforms;
  }

  return theme;
}

@route('/api/themes')
export default class ThemeApi {
  constructor({ logger, themeSearchService, themeStore }) {
    this.logger = logger;
    this.searchService = themeSearchService;
    this.themeStore = themeStore;
  }

  @GET()
  @before([validate(v.index)])
  async find(ctx) {
    if (ctx.query.sort) {
      ctx.query.sort = Utils.transformSort(ctx.query.sort);
    }

    if (ctx.query.q && ctx.query.aggregate) {
      let { page, limit } = ctx.query;
      page = page || 1;
      limit = limit || 15;
      const results = await this.searchService.aggregate(
        ctx.query.q,
        page,
        limit
      );
      ctx.ok({ status: 200, message: 'aggregate_search', ...results[0] });
    } else if (ctx.query.q) {
      const results = await this.searchService.search(ctx.query.q, ctx.query);
      ctx.ok({ status: 200, message: 'simple_search', ...results });
    } else {
      const { withDraft, withTrash } = ctx.query;
      const conditions = {};

      if (withTrash) {
        conditions.deletedAt = { $ne: null };
      }

      if (withDraft !== undefined) {
        conditions.draft = { $eq: withDraft };
      }

      const results = await this.themeStore.find(conditions, ctx.query);
      ctx.ok({ status: 200, message: 'all', ...results });
    }
  }

  @route('/:id')
  @GET()
  @before([validate(v.get)])
  async get(ctx) {
    const result = await this.themeStore.findByIdOrSlug(ctx.params.id);
    ctx.assert(result, 404, `theme ${ctx.params.id} not found!`, {
      message: `theme ${ctx.params.id} not found!`,
    });
    ctx.ok({ status: 200, message: 'found', result });
  }

  @POST()
  @before([
    passport.authenticate('jwt', { session: false }),
    upload.single('icon'),
  ])
  async post(ctx) {
    const theme = setIconIfPresent(ctx, ctx.request.body);
    const { id } = await this.themeStore.create(theme);
    ctx.assert(id, 400);
    ctx.set('Location', `/api/themes/${id}`);
    ctx.created({ status: 201, message: 'created', id });
  }

  @route('/:id')
  @PUT()
  @before([
    passport.authenticate('jwt', { session: false }),
    upload.single('icon'),
  ])
  async put(ctx) {
    const result = await this.themeStore.findByIdOrSlug(ctx.params.id);
    ctx.assert(result, 404, `theme ${ctx.params.id} not found!`, {
      message: 'not_found',
    });

    const theme = setIconIfPresent(ctx, ctx.request.body);
    await this.themeStore.update(ctx.params.id, theme);
    ctx.ok({ status: 200, message: 'updated' });
  }

  @route('/:id/restore')
  @PUT()
  @before([passport.authenticate('jwt', { session: false })])
  async restore(ctx) {
    const doc = await this.themeStore.findByIdOrSlug(ctx.params.id);
    ctx.assert(doc, 404, `theme ${ctx.params.id} not found!`, {
      message: 'not_found',
    });
    const result = await this.themeStore.restore(ctx.params.id);
    ctx.ok({ status: 200, message: 'restored', result });
  }

  @route('/:id')
  @DELETE()
  @before([passport.authenticate('jwt', { session: false })])
  async delete(ctx) {
    const doc = await this.themeStore.findByIdOrSlug(ctx.params.id);

    ctx.assert(doc, 404, `theme ${ctx.params.id} not found!`, {
      message: `theme ${ctx.params.id} not found!`,
    });

    const result = await this.themeStore.delete(ctx.params.id, ctx.query);

    ctx.ok({ status: 200, message: 'deleted', result });

    if (ctx.query.hard && doc._metadata && doc._metadata.s3) {
      const params = {
        BucketName: process.env.AWS_S3_BUCKET,
        Delete: {
          Objects: doc._metadata.s3.map((f) => {
            f.key;
          }),
        },
      };

      s3.deleteObjects(params, (err, data) => {
        if (err) {
          this.logger.error('s3 objects deletion error', { data, error: err });
        }
      });
    }
  }

  @route('/upload')
  @POST()
  @before([
    passport.authenticate('jwt', { session: false }),
    koaBody({
      multipart: true,
      formidable: {
        keepExtensions: true,
        hash: 'sha1',
        multiples: false,
      },
    }),
  ])
  upload(ctx) {
    const files = ctx.request.files;
    ctx.ok({ status: 200, message: 'file_uploaded', files });
  }
}
