import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const MODEL_NAME = 'LinkBotReport';

export const STATUS_PASSED = 'PASSED';
export const STATUS_FAILED = 'FAILED';
export const STATUS_PENDING = 'PENDING';

const LinkBotReportSchema = new Schema(
  {
    read: { type: Schema.Types.Boolean, default: false },
    status: { type: String, default: STATUS_PENDING },
    nextCheck: Schema.Types.Date,
    deadLinks: [Object],
  },
  { timestamps: true }
);

LinkBotReportSchema.plugin(paginate);

export default mongoose.model(MODEL_NAME, LinkBotReportSchema);
