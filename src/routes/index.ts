import { Router } from "express";
import Controller from '../controller';
import AwsController from '../controller/getSignedUrls'
import { AuthCheck,TokenCheck } from "../middlewares/authenticate";
import Validators from "../middlewares/validate";

const route:Router = Router()

const { 
    SignInValidation,ForgotPassValidation,
    ResetPassValidation,GetObjectValidation,
    CreateObjectValidation
} = Validators

/** User APIs */
route.get('/', Controller.WelcomeApi)
route.post('/signin', SignInValidation, Controller.userSignin)
route.post('/forgot-password', ForgotPassValidation, Controller.Forgot)
route.post('/reset-password/:token', TokenCheck, ResetPassValidation, Controller.Reset)
route.get('/verify-token/:token', TokenCheck, Controller.tokenSignin)
route.get('/validate-user/:id', Controller.ValidateUser)
route.get('/users', Controller.getAllUsers)

/** Signed Url APIs */
route.post('/get-signed-urls', GetObjectValidation, AwsController.getSignedUrl)
route.post('/create-signed-urls', CreateObjectValidation, AwsController.createSignedUrl)


export default route
