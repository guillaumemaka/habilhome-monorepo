import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import slug from 'slug';

const MODEL_NAME = 'Theme';

const { Schema } = mongoose;

const ThemeSchema = new Schema(
  {
    /**
     * Theme icon
     */
    icon: { type: Object, default: null },

    /**
     * Theme name
     */
    name: { type: String, required: true },

    /**
     * Theme slug
     */
    slug: { type: String, required: true, unique: true },

    /**
     * Theme description
     */
    description: String,

    /**
     * Theme subthemes
     */
    subThemes: [String],

    /**
     * Theme draft flag
     */
    draft: { type: Boolean, default: true },

    /*********************************************
     * Timestamps
     *********************************************/

    /**
     * Theme created date
     */
    createdAt: { type: Date, default: Date.now },

    /**
     * Theme deleted date
     */
    deletedAt: Date,

    /**
     * Theme update date
     */
    updatedAt: Date,

    /**
     * Theme update date
     */
    publishedAt: Date,

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
     * declare nested fields to avoid castForQueryWrapper or castForQuery error
     */
    translation: [
      {
        description: String,
        language: String,
        name: String,
        subThemes: [String],
        slug: String,
      },
    ],
    /**
     * Store metadata
     *
     */
    _metadata: { type: Object, default: {} },
  },
  { strict: false }
);

ThemeSchema.plugin(paginate);

ThemeSchema.pre('validate', function (next) {
  this.slugify();

  next();
});

ThemeSchema.methods.slugify = function () {
  if (!this.name) return;

  this.slug = slug(this.name, { lower: true });

  if (this.translation) {
    for (let i = 0; i < this.translation.length; i++) {
      if (this.translation[i].name) {
        this.translation[i].slug = slug(this.translation[i].name, {
          lower: true,
        });
      }
    }
  }
};

ThemeSchema.index(
  {
    name: 1,
    subThemes: 1,
    // 'translation.name': 1,
    // 'translation.subThemes': 1,
  }
  // ,
  // {
  //   weights: { name: 10, subThemes: 5 },
  //   name: 'TextIndex',
  //   default_language: 'fr'
  // }
);

export default mongoose.model(MODEL_NAME, ThemeSchema);
