import { Document, Model } from "mongoose";

// export interface IUser {
//   firstName: string;
//   lastName: string;
//   age: number;
//   dateOfEntry?: Date;
//   lastUpdated?: Date;
// }

export type UserRoleType = "admin" | "manager" | "customer"
export interface IUser {
  username: string;
  password: string;
  email: string;
  role: UserRoleType;
  createdAt?: Date;
  updatedAt?: Date;
  // restaurant?: Restaurant;
  // profile?: Profile;
}

export interface IUserDocument extends IUser, Document {
  setLastUpdated: (this: IUserDocument) => Promise<void>;
  sameLastName: (this: IUserDocument) => Promise<Document[]>;
}


export interface IUserModel extends Model<IUserDocument> {
  findOneOrCreate: (
    this: IUserModel,
    {
      username,
      password,
      email,
      role,
      createdAt,
      updatedAt,
    }: IUser
  ) => Promise<IUserDocument>;
  findByAge: (
    this: IUserModel,
    min?: number,
    max?: number
  ) => Promise<IUserDocument[]>;
}
// export interface IUserModel extends Model<IUserDocument> {
//   findOneOrCreate: (
//     this: IUserModel,
//     {
//       firstName,
//       lastName,
//       age,
//     }: { firstName: string; lastName: string; age: number }
//   ) => Promise<IUserDocument>;
//   findByAge: (
//     this: IUserModel,
//     min?: number,
//     max?: number
//   ) => Promise<IUserDocument[]>;
// }