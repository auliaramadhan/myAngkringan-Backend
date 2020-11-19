import {UserController} from "../controller/UserController";
import * as express from 'express'
import { routeUser } from "./userRoute";
import { routeItem } from "./itemRoute";
import { routeReview } from "./reviewRoute";
import { routeRestaurant } from "./restaurantRoute";
import { routeProfile } from "./profileRoute";
// import * as express from 'express'

const Routes = express.Router()

Routes.use('/user', routeUser )
Routes.use('/item', routeItem )
// Routes.use('/review', routeReview )
// Routes.use('/restaurant', routeRestaurant )
// Routes.use('/profile', routeProfile )

export {Routes};


// export const Routes = [{
//     method: "get",
//     route: "/users",
//     controller: UserController,
//     action: "all"
// }, {
//     method: "get",
//     route: "/users/:id",
//     controller: UserController,
//     action: "one"
// }, {
//     method: "post",
//     route: "/users",
//     controller: UserController,
//     action: "save"
// }, {
//     method: "delete",
//     route: "/users/:id",
//     controller: UserController,
//     action: "remove"
// }];

