require("dotenv").config();
import { UserController } from '../controller/UserController';
import { NextFunction, Request, Response } from "express";
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer'
import { responseSuccess } from '../util/Response';
import { ErrorHandler } from '../util/ErrorHandler';
import { IUser, User } from '../entity/User';
import { auth, logout } from '../util/auth';
import { Connection, getConnection } from 'typeorm';


const route = express.Router()

const userController = new UserController()

route.get('/', auth(['admin']) , async (request: Request, response: Response, next: NextFunction) => {
	const name = await userController.all(next)

	if (typeof name === undefined) { return; }
	responseSuccess(response, name)
})

route.post('/auth',auth([]), async (req: Request, res: Response, next: NextFunction) => {
	if (
		req.headers["authorization"] &&
		req.headers["authorization"].startsWith("Bearer")
	) {
		const jwt_token = req.headers["authorization"].substr(7);
		try {
			const user = jwt.verify(jwt_token, process.env.APP_KEY);
			res.send({ success: true, user });
			return;
		} catch (err) {
			if (err.message === "jwt expired")
				res.send({ success: false, msg: "jwt token expired login again" });
			else res.send({ success: false, msg: "jwt invalid" });
		}
	} else {
		res.send({ success: false, msg: "must login first" });
	}
})

route.post('/registrasi', async (request: Request, response: Response, next: NextFunction) => {
	// const newUser = await userController.save(request)
	const newUser = await userController.save(request, next)

	if (typeof newUser === undefined) { return; }
	responseSuccess(response, newUser)
})

route.post('/createManager', async (request: Request, response: Response, next: NextFunction) => {
	// const newUser = await userController.save(request)
	request.body.role = 'manager'
	const newUser = await userController.save(request, next)

	if (typeof newUser === undefined) { return; }
	responseSuccess(response, newUser)
})

route.put("/changepassword/:username", auth([]), async (req: Request, res: Response, next: NextFunction) => {
	const dataUser: IUser = <IUser>req.user
	
	if (req.params.username !== dataUser.username) {
		const error = new ErrorHandler(401, 'unauthorized')
		next(error)
		return;
	}
	const success = await userController.changePassword(req, next)
	if (typeof success === undefined) { return; }
	responseSuccess(res, success)
});

route.put("/changeroles/:username", auth(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	const success = await userController.change(req, next)

	if (typeof success === undefined) { return; }
	responseSuccess(res, success)
});

route.post("/login", async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;

	console.log(req.body)

	const dataUser = await userController.getOne(req, next)

	if (typeof dataUser === undefined) { return; }
	if (bcrypt.compareSync(password, dataUser.password)) {
		const { password, ...signToJWT } = dataUser
		const auth = jwt.sign(signToJWT, process.env.APP_KEY);
		//   { expiresIn: "1d" }
		res.send({ success: true, auth });
	} else {
		res.send({
			success: false,
			msg: "user or password incorrect"
		});
	}
});

route.post("/logout", auth([]), logout);

route.post('/forgot_password', async (req: Request, res: Response, next: NextFunction) => {
	var newPassword = ''
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < 6; i++) {
		newPassword += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	const User: User = await userController.getOne(req, next)

	if (typeof User === undefined) { return; }

	const { username } = User

	try {
		req.body = User
		req.body.password = newPassword
		const success = await userController.changePassword(req, next)
		
		if (typeof success === undefined) { return; }

		var transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			requireTLS: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		})

		var mailOptions = {
			from: process.env.SMTP_USER,
			to: User.email,
			subject: '<Dont Repply Email>',
			text: 'your new password for username ' + username + ' is ' + newPassword + `\n please immediately change after login`
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				res.send({
					succes: false,
					msg: 'error in database'
				})
				throw err
			} else {
				console.log('Email sent: ' + info.response);
				res.send({
					succes: true,
					msg: 'check your email'
				})
			}
		})

	} catch (error) {
		res.send({ success: false, msg: error });
	}

})

export {route as routeUser};

