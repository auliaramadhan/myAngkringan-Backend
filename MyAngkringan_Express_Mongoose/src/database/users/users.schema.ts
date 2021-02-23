import { model, Schema } from "mongoose";
import { findAllManager, setLastUpdated } from "./users.method";
import { findByAge, findOneOrCreate } from "./users.statics";
import { IUser, IUserDocument, IUserModel } from "./users.types";
// const UserSchema = new Schema<IUserDocument>({
//   firstName: String,
//   lastName: String,
//   age: Number,
//   dateOfEntry: {
//     type: Date,
//     default: new Date()
//   },
//   lastUpdated: {
//     type: Date,
//     default: new Date()
//   }
// });
const UserSchema = new Schema<IUserDocument>({
  username: String,
  password: String,
  email: String,
  role: String,
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;
UserSchema.statics.findByAge = findByAge;
UserSchema.methods.setLastUpdated = setLastUpdated;
UserSchema.methods.findAllManager = findAllManager;

export const UserModel = model<IUserDocument>(
  "user",
  UserSchema
) as IUserModel;


export default UserSchema;
