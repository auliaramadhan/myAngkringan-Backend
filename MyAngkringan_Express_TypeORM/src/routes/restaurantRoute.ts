import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import * as multer from 'multer'
import { auth, logout } from '../util/auth';
import { RestaurantController } from '../controller/RestaurantController';
import { responseSuccess } from '../util/Response';
import { Restaurant } from '../entity/Restaurant';
import { FileUpload, dirUpload } from '../util/FileUpload';

const route = express.Router()
const fileUpload = new FileUpload(dirUpload.Restauran)
const upload = fileUpload.upload

const restaurantController = new RestaurantController()


route.get("/", async (request: Request, response: Response, next: NextFunction) => {

    const listResto = await restaurantController.all(next)

    if (typeof listResto === undefined) { return; }
    responseSuccess(response, listResto, 0, request.body.option)

});

route.get("/:id", auth([]), async (request: Request, response: Response, next: NextFunction) => {
    const resto = await restaurantController.getOne(request, next)

    if (typeof resto === undefined) { return; }
    responseSuccess(response, resto)
});

route.post("/", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file.path;
        request.body.logo = dirImage ?? undefined
        const success = await restaurantController.save(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)

    });

route.put("/:id", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file?.path;
        request.body.logo = dirImage ?? undefined
        const success = await restaurantController.update(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)
    });

route.delete("/:id", auth(["admin"]),
    async (request: Request, response: Response, next: NextFunction) => {
        const resto :Restaurant = await restaurantController.getOne(request, next)
        if (typeof resto === undefined) { return; }
        const success = await restaurantController.remove(request, next)
        const dirImage = resto.logo;
        if (typeof success === undefined) {return;}

        fileUpload.unlinkImange(dirImage)
        responseSuccess(response, success)
    });

export { route as routeRestaurant };
