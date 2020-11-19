import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors"
import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'
import { Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { ErrorHandler, responseError } from './util/ErrorHandler';
import * as multer from 'multer';
import { DBConnection } from './util/Connection';

// createConnection(require('../ormconfig.ts') ).then(async connection => {

//     console.log(connection.isConnected)
//     // create express app
//     const app = express();
//     app.use(bodyParser.json());

//     // register express routes from defined application routes
//     // Routes.forEach(route => {
//     //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
//     //         const result = (new (route.controller as any))[route.action](req, res, next);
//     //         if (result instanceof Promise) {
//     //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

//     //         } else if (result !== null && result !== undefined) {
//     //             res.json(result);
//     //         }
//     //     });
//     // });

//     // Route APi
//     //  ada masalah disini
//     app.use('/api', Routes)

//     app.use( (error: ErrorHandler, req: any, res: any, next :any) => {
//         responseError(res, error.message, error.statusCode )
//     } )

//     // setup express app here
//     // ...

//     // start express server
//     app.listen(3000);

//     // insert new users for test
//     // const admin = await connection.manager.create(User, {
//     //     username: "admin",
//     //     password: "admin",
//     //     role:'admin'
//     // })
//     // admin.hashPassword(admin.password)
//     // await connection.manager.save(admin);
//     console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

// }).catch(error => console.log(error));

// create express app
( async() => {

const upload = multer();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
        info: {
            title: 'Hello World', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: [
        './src/route/item.js',
        './src/route/cart.js',
    ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// ini dibawah biar bisa pake form data
// app.use( upload.array());
app.use(express.static(__dirname + "/../../public"));

// Route APi
//  ada masalah disini
while (DBConnection.connection === null ||DBConnection.connection === undefined) {
    await DBConnection.connect()
    console.log(DBConnection.connection)
    app.use('/api', Routes)
}

app.use((error: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    responseError(res, error.message, error.statusCode)
})

// setup express app here
// ...

// start express server
app.listen(process.env.APP_PORT, async () => {
    console.log(`Server listenning on port ${process.env.APP_PORT}`);
});

})()
