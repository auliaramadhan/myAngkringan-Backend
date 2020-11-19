import { getRepository, Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { IProfile, Profile } from '../entity/Profile';
import * as bcrypt from 'bcryptjs';
import { DBConnection } from '../util/Connection';
export class UserController {
    
    private userRepository: Repository<User>;

    constructor() {
        this.connectToDatabase()
    }


    async connectToDatabase() {
        console.log(this.userRepository)
        const connection = await DBConnection.connect()
        this.userRepository = connection.getRepository(User)
        console.log(this.userRepository)
        return ;
    }


    async all(next: NextFunction) {
        try {
            const listUser = await this.userRepository.find();
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getOne(request: Request, next: NextFunction) {
        try {
            const { password, ...dataSearch } = request.body
            return this.userRepository.findOneOrFail({ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: IUser = request.body
            const profileBody: IProfile = data.profile
            const profil: Profile = profileBody && await getRepository(Profile).create({
                firstName: profileBody.firstName,
                lastName: profileBody.lastName,
                phoneNumber: profileBody.phoneNumber,
            })
            const newUser: User = this.userRepository.create({
                username: data.username,
                role: data.role,
                profile: profil
            });
            newUser.hashPassword(data.password)
            return this.userRepository.save(newUser)
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async saveLangsung(request: Request, next: NextFunction) {
        try {
            const data: IUser = request.body
            return await this.userRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async createManager(request: Request, next: NextFunction) {
        try {
            const data: IUser = request.body
            return this.userRepository.save(data)
        } catch (error) { return handleErrorDatabase(error, next) }

    }

    async change(request: Request, next: NextFunction) {
        try {
            const dataBody: IUser = request.body
            const dataUser: IUser = <IUser>request.user
            const dataSave: IUser = { ...dataUser, ...dataBody, }
            return this.userRepository.save(dataSave)
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async changePassword(request: Request, next: NextFunction) {
        try {
            const password: string = request.body.password
            const enc_pass = bcrypt.hashSync(password);
            const dataUser: IUser = <IUser>request.user
            const dataSave: IUser = { ...dataUser, password: enc_pass }
            return this.userRepository.save(dataSave)
        } catch (error) { return handleErrorDatabase(error, next) }
    }



    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            //     let userToRemove = await this.userRepository.findOne(request.params.id);
            // await this.userRepository.remove(userToRemove);
            await this.userRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }


    }

}