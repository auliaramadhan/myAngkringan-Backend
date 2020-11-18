import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import { ErrorHandler, responseError } from './util/ErrorHandler';


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // Route APi
    //  ada masalah disini
    // app.use('/api', Routes)

    app.use( (error: ErrorHandler, req: any, res: any, next :any) => {
        responseError(res, error.message, error.statusCode )
    } )

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    const admin = await connection.manager.create(User, {
        username: "admin",
        password: "admin",
        role:'admin'
    })
    admin.hashPassword(admin.password)
    await connection.manager.save(admin);
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     age: 24
    // }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
