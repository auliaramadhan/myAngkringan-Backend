
import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import * as multer from 'multer'
import { auth, } from '../util/auth';
import { responseSuccess } from '../util/Response';
import { FileUpload, dirUpload } from '../util/FileUpload';
import { ReviewController } from '../controller/ReviewController';
export * as  fs from "fs"

const route = express.Router()

const reviewController = new ReviewController()

route.get([""], async (request: Request, response: Response, next: NextFunction) => {

    const listreview = await reviewController.all(next)

    if (typeof listreview === undefined) { return; }
    responseSuccess(response, listreview, 0, request.body.option)
});

route.get('/query', async (request: Request, response: Response, next: NextFunction) => {

    const listreview = await reviewController.findAll(request, next)

    if (typeof listreview === undefined) { return; }
    responseSuccess(response, listreview, 0, request.body.option)
});

route.get("/:id", auth([]), async (request: Request, response: Response, next: NextFunction) => {
    const review = await reviewController.getOne(request, next)

    if (typeof review === undefined) { return; }
    responseSuccess(response, review)
});

route.post("/", auth(["admin"]), async (request: Request, response: Response, next: NextFunction) => {
    const dirImage = request.file.path;
    request.body.image = dirImage ?? undefined
    const success = await reviewController.save(request, next)

    if (typeof success === undefined) { return; }
    responseSuccess(response, success)

});

route.put("/:id", auth(["admin"]), async (request: Request, response: Response, next: NextFunction) => {
    const dirImage = request.file?.path;
    request.body.image = dirImage ?? undefined
    const success = await reviewController.update(request, next)

    if (typeof success === undefined) { return; }
    responseSuccess(response, success)
});

route.delete("/:id", auth(["admin"]),
    async (request: Request, response: Response, next: NextFunction) => {
        const success = await reviewController.remove(request, next)
        if (typeof success === undefined) { return; }
        responseSuccess(response, success)
    });


export { route as routeReview }