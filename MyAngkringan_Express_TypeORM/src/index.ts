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

import * as socketIO from 'socket.io';
import { responseSuccess } from './util/Response';


// create express app
( async() => {

const upload = multer();
const app = express();

let server = require("http").Server(app);
let io : socketIO.Server  = require("socket.io")(server);


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
    // Path to the API docss
    apis: [
        "./swagger/*.yaml" ,
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
    // console.log(DBConnection.connection)
    app.use('/api', Routes)
}

app.use((error: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    responseError(res, error.message, error.statusCode)
})

// setup express app here
// ...

// start express server
server.listen(process.env.APP_PORT, () => {
    console.log(`Server listenning on port ${process.env.APP_PORT}`);
});

app.post('/room', (req: Request, res: Response) => {
  if (rooms[req.body.room] != null) {
    return responseSuccess(res, 'room already exist' )
  }
  rooms[req.body.room] = { users: {} }
  // Send message that new room was created
  io.emit('room-created', req.body.room)
  return responseSuccess(res, 'room ccreated' )
})



io.on('connection', (socket : socketIO.Socket) => {
  socket.on('new-user', (room: string, name: string) => {
      socket.join(room)
      rooms[room].users[socket.id] = name
      socket.to(room).broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', (room, message) => {
      socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
      getUserRooms(socket).forEach(room => {
        socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
        delete rooms[room].users[socket.id]
      })
    })
})

})()

const rooms : tRooms = { }

type tRooms = {
  [P in string]?: {
    users : {[ P in string ] ?: string}
  }
}


function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [roomName, room]) => {
      if (room.users[socket.id] != null) names.push(roomName)
      return names
    }, [])
  }