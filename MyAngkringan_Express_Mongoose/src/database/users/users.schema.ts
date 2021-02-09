import { Schema } from "mongoose";
import { sameLastName, setLastUpdated } from "./users.method";
import { findByAge, findOneOrCreate } from "./users.statics";
import { IUser, IUserDocument, IUserModel } from "./users.types";
const UserSchema = new Schema<IUserDocument>({
  firstName: String,
  lastName: String,
  age: Number,
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
  lastUpdated: {
    type: Date,
    default: new Date()
  }
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;
UserSchema.statics.findByAge = findByAge;
UserSchema.methods.setLastUpdated = setLastUpdated;
UserSchema.methods.sameLastName = sameLastName;


export default UserSchema;
