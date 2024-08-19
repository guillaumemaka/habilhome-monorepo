import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: false },
  deactivatedAt: { type: Date },
  roles: { type: [String], default: ['user'] },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  _meta: { type: Object, default: null },
});

UserSchema.plugin(paginate);

// Compound index for full text search
UserSchema.index({ lastName: 'text', firstName: 'text' });

UserSchema.methods.setPassword = function (password) {
  const hash = bcrypt.hashSync(password, 10);
  this.password = hash;
};

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      // exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: this.email,
    },
    process.env.JWT_SECRET
  );
};

UserSchema.methods.toJSON = function () {
  const {
    firstName,
    lastName,
    email,
    active,
    deactivatedAt,
    roles,
    updatedAt,
    createdAt,
    deletedAt,
    verifiedAt,
    _meta,
  } = this;

  const token = this.generateJWT();

  return {
    firstName,
    lastName,
    email,
    active,
    deactivatedAt,
    roles,
    updatedAt,
    createdAt,
    deletedAt,
    verifiedAt,
    _meta,
    token,
  };
};

UserSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export default mongoose.model('User', UserSchema);
