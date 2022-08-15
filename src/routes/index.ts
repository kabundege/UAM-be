import { Router } from "express";
import Controller from '../controller';
import AwsController from '../controller/getSignedUrls'
import { AuthCheck } from "../middlewares/authenticate";
import Validators from "../middlewares/validate";

const route:Router = Router()

const { 
    SignInValidation,ForgotPassValidation,
    ResetPassValidation,GetObjectValidation,
    CreateObjectValidation
} = Validators

/** User APIs */
route.get('/', Controller.WelcomeApi)
route.post('/signin', SignInValidation, Controller.Signin)
route.post('/forgot-password', ForgotPassValidation, Controller.Forgot)
route.post('/reset-password', AuthCheck, ResetPassValidation, Controller.Reset)
route.get('/verify-token/:token', AuthCheck, Controller.validateToken)
route.get('/users', Controller.getAllUsers)

/** Signed Url APIs */
route.post('/get-signed-urls', GetObjectValidation, AwsController.getSignedUrl)
route.post('/create-signed-urls', CreateObjectValidation, AwsController.createSignedUrl)


export default route
