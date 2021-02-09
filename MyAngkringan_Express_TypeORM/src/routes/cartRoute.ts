import { CartController } from './../controller/CartController';

import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import { auth, } from '../util/auth';
import { responseSuccess } from '../util/Response';

const route = express.Router()

const cartController = new CartController()

route.get("/", auth(['admin','customer']) ,async (request: Request, response: Response, next: NextFunction) => {

    const listcart = await cartController.all(next)

    if (typeof listcart === undefined) { return; }
    responseSuccess(response, listcart, 0, request.body.option)
});

route.get("/:id", auth(['customer']), async (request: Request, response: Response, next: NextFunction) => {
    const cart = await cartController.getOne(request, next)

    if (typeof cart === undefined) { return; }
    responseSuccess(response, cart)
});

route.post("/", auth(['customer']), async (request: Request, response: Response, next: NextFunction) => {
    const dirImage = request.file.path;
    request.body.image = dirImage ?? undefined
    const success = await cartController.save(request, next)

    if (typeof success === undefined) { return; }
    responseSuccess(response, success)

});

route.put("/:id", auth(['customer']), async (request: Request, response: Response, next: NextFunction) => {
    const success = await cartController.update(request, next)

    if (typeof success === undefined) { return; }
    responseSuccess(response, success)
});

route.delete("/:id", auth(['customer']),
    async (request: Request, response: Response, next: NextFunction) => {
        const success = await cartController.remove(request, next)
        if (typeof success === undefined) { return; }
        responseSuccess(response, success)
    });


export { route as routeCart }