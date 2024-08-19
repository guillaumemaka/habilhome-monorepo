import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import slug from 'slug';

const { Schema } = mongoose;

const MODEL_NAME = 'DomainModel';

const options = { discriminatorKey: 'kind' };

const AbstractSchema = new Schema(
  {
    /**
     * Application/Object name
     */
    name: String,

    /**
     * Application/Object slug
     */
    slug: { type: String, required: true, unique: true },

    /**
     * Application/Object operating systen (ex: Android, Apple, Blackberry??? )
     */
    os: String,

    /**
     * Application/Object company name
     */
    companyName: String,

    /**
     * Application/Object main image url
     */
    imageUrl: String,

    /**
     * Application/Object price
     *
     */
    price: {
      low: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      currency: String,
      free: { type: Boolean, default: false },
      variable: { type: Boolean, default: false },
      inAppPurchased: { type: Boolean, default: false },
      fixedPrice: { type: Boolean, default: false },
    },

    /**
     * Application/Object links
     * ex:
     * [
     *  {title: 'Website', alt: '', link: 'http://...'},
     *  {title: 'Support', alt: '', link: 'http://...'}
     * ]
     */
    links: Array,

    /**
     * Application/Object description
     */
    description: String,

    /**
     * Application/Object favorited  by the tean
     *
     */
    favorite: Boolean,

    /**
     * Application/Object draft flag
     *
     * true, the application/Object will not show in search results
     */
    draft: Boolean,

    /**
     * Application/Object translated flag
     *
     * true, the application/Object is translated
     */
    translated: Boolean,

    /**
     * Application/Object themes
     *
     */
    themes: [String],

    /**
     * Application/Object subthmes
     */
    subThemes: [String],

    /*********************************************
     * Timestamps
     *********************************************/

    /**
     * Application/Object created date
     */
    createdAt: { type: Date, default: Date.now },

    /**
     * Application/Object deleted date
     */
    deletedAt: Date,

    /**
     * Application/Object publish date
     */
    publishedAt: Date,

    /**
     * Application/Object update date
     */
    updatedAt: Date,

    /*********************************************
     * Mongodb search text index related settings
     *********************************************/

    /**
     * Language default
     */
    language: { type: String, default: 'fr' },

    /**
     * Document specific translations
     * [
     * {language: 'en', ...correspoinding document fields}
     * ]
     *
     */
    translation: [Object],
  },
  options
);

/*********************************************
 * Plugins
 *********************************************/

AbstractSchema.plugin(mongoosePaginate);

/*********************************************
 * Indexes
 *********************************************/

AbstractSchema.index(
  {
    // themes: 1,
    // subThemes: 1,
    name: 1,
    slug: 1,
    // 'translation.slug': 1,
    // 'translation.themes': 1,
    // 'translation.subThemes': 1,
    // 'translation.name': 1,
  }
  // ,
  // {
  //   weights: { name: 15, themes: 10, subThemes: 5 },
  //   name: "TextIndex",
  //   default_language: "fr",
  // }
);

AbstractSchema.pre('validate', function (next) {
  this.slugify();

  next();
});

AbstractSchema.methods.slugify = function () {
  if (!this.name) return;

  const $slug = slug(this.name, { lower: true });

  this.slug = $slug;

  for (let i = 0; i < this.translation.length; i++) {
    if (this.translation[i]) {
      if (this.translation[i].name) {
        this.translation[i].slug = slug(this.translation[i].name, {
          lower: true,
        });
      } else {
        this.translation[i].slug = $slug;
      }
    }
  }
};

const DomainModel = mongoose.model(MODEL_NAME, AbstractSchema);

const Application = DomainModel.discriminator(
  'Application',
  new Schema(
    {
      /**
       * Application/Object comment
       *
       */
      comment: String,

      /**
       * Application device restrictions
       */
      deviceRestritions: String,

      /**
       * Application/Object links
       * ex:
       * ["en", "fr"]
       */
      lang: [String],

      /**
       * Application required abilities
       *
       */
      requiredAbilities: String,

      /**
       * Application customizable language flag
       */
      customizableLang: Boolean,
    },
    options
  )
);

const ConnectedObject = DomainModel.discriminator(
  'ConnectedObject',
  new Schema(
    {
      /**
       * Application/Object comment
       *
       */
      precision: String,
      additionalDeviceNeeded: String,
      complementaryDevice: String,
      mobileAppNeeded: String,
    },
    options
  )
);

export { Application, ConnectedObject, DomainModel };
