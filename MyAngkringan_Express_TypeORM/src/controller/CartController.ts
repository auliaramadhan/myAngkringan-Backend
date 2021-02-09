import { getRepository, FindManyOptions, Repository, MoreThanOrEqual } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { Cart, ICart } from '../entity/Cart';
import { Restaurant } from '../entity/Restaurant';
import { DBConnection } from '../util/Connection';

export class CartController {
    private cartRepository: Repository<Cart>;
    // private restaurantRepository = getRepository(Restaurant);


    constructor() {
        this.connectToDatabase()
    }

    async connectToDatabase() {
        const connection = await DBConnection.connectionWait() 
        this.cartRepository = connection.getRepository(Cart);
        return;
    }

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
            const listUser = await this.cartRepository.find();
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getByUser(next: NextFunction, request?: Request) {
        try {
            const listUser = await this.cartRepository.find( {where:{ userId : request.params.id }} );
            if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listUser
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

   //  async findAll(request: Request, next: NextFunction) {
   //      try {
   //          const body = request.body
   //          // const option = this.limitOption(request)
   //          // body.option = option
   //          const listUser = await this.cartRepository.find({ where: request.body});
   //          if (listUser.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
   //          return listUser
   //      } catch (error) { return handleErrorDatabase(error, next,) }
   //  }

    async getOne(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            dataSearch.id = request.params.id
            return this.cartRepository.findOneOrFail({ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: ICart = request.body
            return await this.cartRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async update(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            const dataUpdate = request.body
            return this.cartRepository.update(id, dataUpdate);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            // let restoToRemove = await this.cartRepository.findOne(request.params.id);
            // await this.cartRepository.remove(restoToRemove);
            await this.cartRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


}