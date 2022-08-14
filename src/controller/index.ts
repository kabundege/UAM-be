import { Request,Response } from 'express'
import mongoose from 'mongoose'
import { ErrorResponse, SuccessResponse } from '../helpers/Responder';
import { AuthInfoRequest } from '../../types';
import User from '../Models/User'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SendEmail } from '../helpers/mailer';

enum AccountStatus { UNVERIFIED, PENDING_VERIFICATION, VERIFIED }

export default class Auth {

    static WelcomeApi = (_:Request, res: Response) => {
        //
        return SuccessResponse(res,200,'Welcome to UAM Backend')
    }

    static getAllUsers = async (_:Request, res: Response) => {

        return User.find().exec()
        .then(users => {
            return SuccessResponse(res,200,'Fetch Success',users)
        })
        .catch(error => {
            return ErrorResponse(res,500,error)
        })
        //
    }

    static validateToken = async (req:AuthInfoRequest, res: Response) => {
        //
        return SuccessResponse(res,200,'Token is valid',req.userData)
    }

    static Signin = async (req:Request,res:Response) =>{

        try{
            const { email,password } = req.body

            const user = await User.findOne({ email }).exec()
   
            if(!user){
                return ErrorResponse(res,400,'Invalid Credentials')
            }

            if (!await bcrypt.compare(password,user.password)) {
                return ErrorResponse(res,400,'Invalid User Credentials');
            }

            const { phoneNumber } = user;
            const token = jwt.sign({ email, phoneNumber },process.env.JWT_SECRET)
            //

            res.cookie('token',token)
            return SuccessResponse(res,200,'Signin Successful',token)

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    static Signup = async (req:Request,res:Response) =>{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const min = 100000,max=999999;
        const code = Math.floor(Math.random() * (max - min) + min)

        const html = `
            <html>
                <head>
                    <link rel="stylesheet" href="index.css">
                </head>
                <body>
                    <script src="index.pack.js"></script>
                    <div style="display:flex;flex-direction:column;align-items:center">
                        <h1>UAM - Verification</h1>
                        <p style="color:#999;text-align:center;margin:2em">Use the six digit code provided below to verify you account</p>
                        <h4>${code}</h4>
                    </div>
                </body>
            </html>
        `;

        await SendEmail(req.body.email, 'UAM ~ Account Verification', html)

        const newUser = new User({
            ...req.body,
            hasTwoFactorAuth: false,
            password: hashedPassword,
            status: AccountStatus.VERIFIED,
            _id: new mongoose.Types.ObjectId(),
        })

        return newUser.save()
        .then(async (user) => {

            const { phoneNumber,email } = user;
            const token = jwt.sign({ email, phoneNumber },process.env.JWT_SECRET)

            return SuccessResponse(res,201,'Signup Successful', { token,user } )
        })
        .catch(error => {
            return ErrorResponse(res,500,error)
        })
        //
    }

    static Verification = async (req:AuthInfoRequest,res:Response) =>{

        try{

            const user = await User.findOne({ email:req.userData.email }).update({ status: AccountStatus.PENDING_VERIFICATION }).exec()
   
            return SuccessResponse(res,200,'Reset Successful',user)

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    static Reset = async (req:AuthInfoRequest,res:Response) =>{

        try{

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = await User.findOne({ email:req.userData.email }).update({ password:hashedPassword }).exec()
   
            return SuccessResponse(res,200,'Reset Successful',user)

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    static Forgot = async (req:Request,res:Response) =>{

        try{
            const { email } = req.body
            const user = await User.findOne({ email }).exec()

            if(!user)
            return ErrorResponse(res, 404,'User Does not exist')

            const { phoneNumber } = user

            const token = jwt.sign({ email, phoneNumber },process.env.JWT_SECRET)

            /** Send Email */
            const link = `https://localhost:3000/reset-password?token=${token}`;
            const html = `
                <html>
                    <head>
                        <link rel="stylesheet" href="index.css">
                    </head>
                    <body>
                        <script src="index.pack.js"></script>
                        <div style="display:flex;flex-direction:column;align-items:center">
                            <h1>UAM [ Reset Password ] </h1>
                            <p style="color:#999;text-align:center;margin:2em">click or copy the link be redirected to the page where your will reset yoru password</p>
                            <a style="color:white;background:dodgerblue;text-decoration:none;padding:.5em 1em;" href="${link}">Reset Password<a/>
                        </div>
                    </body>
                </html>
            `
            await SendEmail(email,'UAM ~ Reset Password',html)

            return SuccessResponse(res,200,'Sent Email Successful')

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

}

