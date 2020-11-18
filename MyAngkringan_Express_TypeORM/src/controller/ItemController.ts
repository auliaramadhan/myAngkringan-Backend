import { getRepository, FindManyOptions } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { Item, IItem } from '../entity/Item';
import { Restaurant } from '../entity/Restaurant';

export class ItemController {
    private itemRepository = getRepository(Item);
    // private restaurantRepository = getRepository(Restaurant);


    limitOption(request: Request) {
        const body = { ...request.body, ...request.query }
        const option: FindManyOptions | any = {}
        option.take = body.limit ? body.limit : 10
        option.skip = body.page ? (body.page - 1) * option.take : 0
        option.currentPage = body.page ?? 1
        return option
    }

    async all(next: NextFunction, request?: Request) {
        try {
            const listUser = await this.itemRepository.find();
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async findAll(request: Request, next: NextFunction) {
        try {
            const body = request.body
            const option = this.limitOption(request)
            body.option = option
            const listUser = await this.itemRepository.find({ where: request.body, ...option, });
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getOne(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            dataSearch.id = request.params.id
            return this.itemRepository.findOneOrFail({ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async getOneWithReview(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            dataSearch.id = request.params.id
            return this.itemRepository.findOneOrFail({ where: { ...dataSearch }, relations: ['review']  });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: IItem = request.body
            return await this.itemRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async update(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            const dataUpdate = request.body
            return this.itemRepository.update(id, dataUpdate);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            // let restoToRemove = await this.itemRepository.findOne(request.params.id);
            // await this.itemRepository.remove(restoToRemove);
            await this.itemRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


}