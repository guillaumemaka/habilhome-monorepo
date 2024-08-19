import mongoose from 'mongoose';

const { Schema } = mongoose;

const MODEL_NAME = 'Configuration';

const SettingSchema = new Schema(
  {
    section: String,
    fields: [
      {
        label: String,
        name: String,
        value: Schema.Types.Mixed,
        valueType: String,
        description: String,
        required: { type: Boolean, default: false },
        scope: { type: [String], default: ['scope_admin'] },
      },
    ],
  },
  { strict: true }
);

export const PUBLIC_SCOPE = 'scope_public';
export const ADMIN_SCOPE = 'scope_admin';

export default mongoose.model(MODEL_NAME, SettingSchema);
