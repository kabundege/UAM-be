import { Request,Response } from 'express'
import { ErrorResponse, SuccessResponse } from '../helpers/Responder';
import { AuthInfoRequest } from '../../types';
import User from '../Models/User'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SendEmail } from '../helpers/mailer';
import Code from '../Models/Code';


enum AccountStatus { UNVERIFIED, PENDING, VERIFICATION, VERIFIED }

class Auth {

    private async sendCode (email:string,userId:string) {
        
        const existingCode = await Code.findOne({ userId }).exec()

        /** 1.  if there's an existing code delete it; */
        if(existingCode)
        await Code.deleteOne({ id:existingCode._id }).exec()

        /** 2. Generate Code & Html Message*/ 
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
                        <p style="color:#999;text-align:center;margin:2em">Use the six digit code provided below to Singin</p>
                        <h4>${code}</h4>
                    </div>
                </body>
            </html>
        `;

        /** Send Email */
        await SendEmail(email, 'UAM ~ Account Verification', html)


        /** save the code & associate user by id */
        const codePayload = new Code({ userId,code })
        await codePayload.save()
    }

    WelcomeApi = (_:Request, res: Response) => {
        //
        return SuccessResponse(res,200,'Welcome to UAM Backend')
    }

    tokenSignin = async (req:AuthInfoRequest, res: Response) => {
        try{
            const { token }  = req.params
            if(!token)
            return ErrorResponse(res, 404, 'Provide a token')
            //
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as  { email:string,phoneNumber:string }
            const user = await User.findOne({ email: decoded.email }).exec()
            //
            if(!user)
            return ErrorResponse(res, 400, 'Invalid Token')

            await this.sendCode(user.email,user._id)
    
            return SuccessResponse(res,200,'Token validation success',{ user })
        }catch(er){
            return ErrorResponse(res, 500, er.message)
        }
    }

    userSignin = async (req:Request,res:Response) =>{

        try{
            const { email,password } = req.body

            const user = await User.findOne({ email }).exec()
   
            if(!user){
                return ErrorResponse(res,400,'Invalid Credentials')
            }

            if (!await bcrypt.compare(password,user.password)) {
                return ErrorResponse(res,400,'Invalid User Credentials');
            }

            const { phoneNumber,_id:userId } = user;
            const token = jwt.sign({ email, phoneNumber },process.env.JWT_SECRET)

            /** Send Code */
            await this.sendCode(email,userId)

            /** Finnaly */
            res.cookie('token',token)
            return SuccessResponse(res,200,'Signin Successful',{ token })

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    getAllUsers = async (_:Request, res: Response) => {

        return User.find().exec()
        .then(users => {
            return SuccessResponse(res,200,'Fetch Success',users)
        })
        .catch(error => {
            return ErrorResponse(res,500,error)
        })
        //
    }

    ValidateUser = async (req:Request, res: Response) => {

        try{
            const {id} = req.params

            if(!id)
            return ErrorResponse(res,401,"provide an id")

            const exists = await User.findById(id).exec()

            if(!exists)
            return ErrorResponse(res,404,"User Not Found")

            
            /** Validate email */
            await User.updateOne({ email: exists.email },{ status: AccountStatus.VERIFIED.toString() }).exec()

            const user = await User.findOne({ email:exists.email }).exec()

            const html = `
                <html>
                    <head>
                        <link rel="stylesheet" href="index.css">
                    </head>
                    <body>
                        <script src="index.pack.js"></script>
                        <div style="display:flex;flex-direction:column;align-items:center">
                            <h1>UAM [ Reset Password ] </h1>
                            <p style="color:#999;text-align:center;margin:2em">The documents you provided while signing up, have been review and found fit, the priccess was a success</p>
                        </div>
                    </body>
                </html>
            `

            await SendEmail(user.email,'UAM ~ Documents Validated',html)

            return SuccessResponse(res,200,'Verification Successful',{ user })
        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    Reset = async (req:AuthInfoRequest,res:Response) =>{

        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = await User.updateOne({ email:req.userData.email },{ password:hashedPassword }).exec()
   
            return SuccessResponse(res,200,'Reset Successful',user)

        }catch(error){
            return ErrorResponse(res,500,error)
        }
    }

    Forgot = async (req:Request,res:Response) =>{

        try{
            const { email } = req.body
            const user = await User.findOne({ email }).exec()

            if(!user)
            return ErrorResponse(res, 404,'User Does not exist')

            const { phoneNumber } = user

            const token = jwt.sign({ email, phoneNumber },process.env.JWT_SECRET)

            /** Send Email */
            const link = `https://uam-fe.vercel.app/reset-password?token=${token}`;
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

export default new Auth()
