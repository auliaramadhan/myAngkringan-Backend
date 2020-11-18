import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import * as multer from 'multer'
import { auth} from '../util/auth';
import { responseSuccess } from '../util/Response';
import { FileUpload, dirUpload } from '../util/FileUpload';
import { ProfileController } from '../controller/ProfileController';
import { Profile } from '../entity/Profile';

const route = express.Router()
const fileUpload = new FileUpload(dirUpload.Profile)
const upload = fileUpload.upload

const profileController = new ProfileController()


route.get("/", async (request: Request, response: Response, next: NextFunction) => {

    const listprofile = await profileController.all(next)

    if (typeof listprofile === undefined) { return; }
    responseSuccess(response, listprofile, 0, request.body.option)

});

route.get("/:id", auth([]), async (request: Request, response: Response, next: NextFunction) => {
    const profile = await profileController.getOne(request, next)

    if (typeof profile === undefined) { return; }
    responseSuccess(response, profile)
});

route.post("/", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file.path;
        request.body.photo = dirImage ?? undefined
        const success = await profileController.save(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)

    });

route.put("/:id", auth(["admin"]), upload.single("image"),
    async (request: Request, response: Response, next: NextFunction) => {
        const dirImage = request.file?.path;
        request.body.photo = dirImage ?? undefined
        const success = await profileController.update(request, next)

        if (typeof success === undefined) {
            fileUpload.unlinkImange(dirImage)
            return;
        }
        responseSuccess(response, success)
    });

route.delete("/:id", auth(["admin"]),
    async (request: Request, response: Response, next: NextFunction) => {
        const profile :Profile = await profileController.getOne(request, next)
        if (typeof profile === undefined) { return; }
        const success = await profileController.remove(request, next)
        const dirImage = profile.photo;
        if (typeof success === undefined) {return;}

        fileUpload.unlinkImange(dirImage)
        responseSuccess(response, success)
    });

export { route as routeProfile };
