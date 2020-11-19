import { FindManyOptions, getRepository, Repository } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { User, IUser } from '../entity/User';
import { ErrorHandler, handleErrorDatabase, ErrCode } from '../util/ErrorHandler';
import { Review, IReview } from '../entity/Review';
import { DBConnection } from '../util/Connection';

export class ReviewController {

    private reviewRepository : Repository<Review>;

    constructor() {
        DBConnection.connect().then(connection => {
            this.reviewRepository = connection.getRepository(Review);
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
            const listReview = await this.reviewRepository.find();
            if (listReview.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listReview
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async findAll(request: Request, next: NextFunction) {
        try {
            const body = request.body
            const option = this.limitOption(request)
            body.option = option
            const listReview = await this.reviewRepository.find({ where: request.body, ...option, });
            if (listReview.length === 0) throw new ErrorHandler(ErrCode.NOT_FOUND)
            return listReview
        } catch (error) { return handleErrorDatabase(error, next,) }
    }

    async getOne(request: Request, next: NextFunction) {
        try {
            const dataSearch = request.body
            dataSearch.id = request.params.id
            return this.reviewRepository.findOneOrFail({ where: { ...dataSearch } });
        } catch (error) { return handleErrorDatabase(error, next) }
    }

    async save(request: Request, next: NextFunction) {
        try {
            const data: IReview = request.body
            return await this.reviewRepository.save(data)
        } catch (error) { return await handleErrorDatabase(error, next) }
    }

    async update(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            const dataUpdate = request.body
            return this.reviewRepository.update(id, dataUpdate);
        } catch (error) { return handleErrorDatabase(error, next) }
    }


    async remove(request: Request, next: NextFunction) {
        try {
            const id = request.params.id
            // let restoToRemove = await this.reviewRepository.findOne(request.params.id);
            // await this.reviewRepository.remove(restoToRemove);
            await this.reviewRepository.delete(id);
        } catch (error) { return handleErrorDatabase(error, next) }
    }

}