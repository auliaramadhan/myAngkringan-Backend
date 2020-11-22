require("dotenv").config();
import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken"
import * as redis from "redis"
import { IUser } from '../entity/User';
const client = redis.createClient(process.env.REDIS_PORT);

export function auth(roles : UserRoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer")
    ) {
      const jwt_token = req.headers.authorization.substring(7);
      console.log(jwt_token)
      client.sismember("revokedToken", jwt_token, (err, reply) => {
        if (reply) {
          res.send({ success: false, msg: "must login first" });
          return;
        }
        try  {
          const verify : {} | string = jwt.verify(jwt_token, process.env.APP_KEY);
          const user : IUser = <IUser>verify
          if (!roles.includes(user.role) && roles.length !== 0) {
            res.send({ success: false, msg: "access denied" });
            return;
          }
          req.user = user;
          next();
        } catch (err) {
            if (err.message === 'jwt expired') res.send({ success: false, msg: "jwt token expired" });
            else res.send({ success: false, msg: "jwt invalid" });
        }
      });
    } else {
      res.send({ success: false, msg: "must login first" });
    }
  };
}

export function logout(req: Request, res: Response) {
  const jwt_token = req.headers["authorization"].substr(7);
  client.sadd("revokedToken", jwt_token);
  res.send({ success: true, msg: "logout success" });
}

export function setallowed(params) {
  return (req, res, next) => {
    if (req.user.roles !== params) {
      res.send({ success: false, msg: "access denied" });
      // fs.unlink(image, err => {
      //   if (err) throw err;
      //  
      // });
      // return;
    } else next();
  };
}
