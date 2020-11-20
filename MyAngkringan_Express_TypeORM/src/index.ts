import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors"
import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'
import { Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
import { ErrorHandler, responseError } from './util/ErrorHandler';
import * as multer from 'multer';
import { DBConnection } from './util/Connection';
import { join } from "path";
import {  } from "./routes/itemRoute";

// create express app
( async() => {

const upload = multer();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

const options : swaggerJSDoc.Options = {
    swaggerDefinition:{
        info: {
            title: "REST API for my App", // Title of the documentation
            version: "1.0.0", // Version of the app
            description: "This is the REST API for my product", // short description of the app
        },
        openapi:'3.0.0',
        host: "localhost:8080", // the host or url of the app
        basePath: "/api", // the basepath of your endpoint
    },
    // definition: {
    //     openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    //     info: {
    //         title: 'My Angkringan', // Title (required)
    //         version: '1.0.0', // Version (required)
    //     },
    // },

    // Path to the API docs
    apis: [
        join(__dirname, "/src/routes/**/*.ts" ) ,
    ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer:true}))


// ini dibawah biar bisa pake form data
// app.use( upload.array());
app.use(express.static( join( __dirname, "/../../public")));

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
