
import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import * as multer from 'multer'
import { auth } from '../util/auth';
import { responseSuccess } from '../util/Response';
import { FileUpload, dirUpload } from '../util/FileUpload';
import { ItemController } from '../controller/ItemController';
import { Item } from '../entity/Item';
export * as  fs from "fs"

const route = express.Router()
const fileUpload = new FileUpload(dirUpload.Item)
const upload = fileUpload.upload

const itemController = new ItemController()

route.get(["", "/search"], async (request: Request, response: Response, next: NextFunction) => {

    const listitem = await itemController.findAll(request, next)

    if (typeof listitem === undefined) { return; }
    responseSuccess(response, listitem, 0, request.body.option)

});
route.get("/:id", auth([]), async (request: Request, response: Response, next: NextFunction) => {
    const item = await itemController.getOne(request, next)

    if (typeof item === undefined) { return; }
    responseSuccess(response, item)
});

route.post("/", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file.path;
        request.body.image = dirImage ?? undefined
        const success = await itemController.save(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)

    });

route.put("/:id", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file?.path;
        request.body.image = dirImage ?? undefined
        const success = await itemController.update(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)
    });

route.delete("/:id", auth(["admin"]),
    async (request: Request, response: Response, next: NextFunction) => {
        const item :Item = await itemController.getOne(request, next)
        if (typeof item === undefined) { return; }
        const success = await itemController.remove(request, next)
        const dirImage = item.image;
        if (typeof success === undefined) {return;}

        fileUpload.unlinkImange(dirImage)
        responseSuccess(response, success)
    });


export {route as routeItem}