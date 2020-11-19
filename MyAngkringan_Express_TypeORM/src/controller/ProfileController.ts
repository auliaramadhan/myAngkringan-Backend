import { getRepository, FindManyOptions, Repository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { Profile, IProfile } from '../entity/Profile';
import { DBConnection } from '../util/Connection';

export class ProfileController {
    private profilRepository : Repository<Profile>;
    // private restaurantRepository = getRepository(Restaurant);

    constructor() {
        this.connectToDatabase()
    }

    async connectToDatabase() {
        const connection = await DBConnection.connectionWait() 
            this.profilRepository = connection.getRepository(Profile);
        return;
    }
    

    async all(next: NextFunction, request?: Request) {
        try {
            const listUser = await this.profilRepository.find();
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async findAll(request: Request, next: NextFunction) {
        try {
            const listUser = await this.profilRepository.find({ where: request.body, });
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getOne(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            const id = request.params.id
            return this.profilRepository.findOneOrFail( id ,{ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: IProfile = request.body
            return await this.profilRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async update(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            const dataUpdate = request.body
            return this.profilRepository.update(id, dataUpdate);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            // let restoToRemove = await this.profilRepository.findOne(request.params.id);
            // await this.profilRepository.remove(restoToRemove);
            await this.profilRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


}