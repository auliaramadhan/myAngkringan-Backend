import { FindManyOptions, getRepository, Repository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { IProfile, Profile } from '../entity/Profile';
import * as bcrypt from 'bcryptjs';
import { Restaurant, IRestaurant } from '../entity/Restaurant';
import { DBConnection } from '../util/Connection';

export class RestaurantController {

    private restaurantRepository :Repository<Restaurant> ;

    constructor() {
        DBConnection.connect().then(connection => {
            this.restaurantRepository = connection.getRepository(Restaurant);
        })
    }

    limitOption(request: Request) {
        const body = request.body
        const option: FindManyOptions | any = {}
        option.take = body.limit ? body.limit : 10
        option.skip = body.page ? (body.page - 1) * option.take : 0
        option.currentPage = body.page ?? 1
        return option
    }

    async all(next: NextFunction, request?: Request) {
        try {
            const listResto = await this.restaurantRepository.find();
            if (listResto.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listResto
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async findAll(request: Request, next: NextFunction) {
        try {
            const body = request.body
            const option = this.limitOption(request)
            body.option = option
            const listResto = await this.restaurantRepository.find({ where: request.body, ...option, });
            if (listResto.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listResto
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getOne(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            dataSearch.id = request.params.id
            return this.restaurantRepository.findOneOrFail({ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: IRestaurant = request.body
            return await this.restaurantRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async update(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            const dataUpdate = request.body
            return this.restaurantRepository.update(id, dataUpdate);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            // let restoToRemove = await this.restaurantRepository.findOne(request.params.id);
            // await this.restaurantRepository.remove(restoToRemove);
            await this.restaurantRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }
    }

}