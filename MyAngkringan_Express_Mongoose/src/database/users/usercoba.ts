import * as bcrypt from 'bcryptjs';
import { Document, Schema, Model, model } from 'mongoose';

// import { IUserDocument } from '../interfaces/IUserDocument';

export interface IUserDocument extends Document {
    email: string;
    name: string;
    password: string;
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean; 
}

export interface IUserModel extends Model<IUser> {
    hashPassword(password: string): string;
}

export const userSchema: Schema = new Schema({
    email: { type: String, index: { unique: true }, required: true },
    name: { type: String, index: { unique: true }, required: true },
    password: { type: String, required: true }
});

userSchema.method('comparePassword', function (password: string): boolean {
    if (bcrypt.compareSync(password, 'sdas')) return true;
    return false;
});

userSchema.static('hashPassword', (password: string): string => {
    return bcrypt.hashSync(password);
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;
