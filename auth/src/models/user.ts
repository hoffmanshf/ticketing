import mongoose from "mongoose";
import { Password } from '../services/password';

// an interface that describes the properties
// that are required to create a new User
interface UserAttributes {
  email: string;
  password: string;
}

// an interface that describes the properties
// that a User model(entire user collection) has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

// an interface that describes the properties
// that a User document has
interface UserDoc extends mongoose.Document {
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema({
  email: {
    // typescript type of String is string
    // mongoose type of String is String
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

// <> is the generic syntax in typescript
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// not ideal: every time use buildUser needs to import User and buildUser
// const buildUser = (attributes: UserAttributes) => {
//   return new User(attributes);
// };

export { User };
