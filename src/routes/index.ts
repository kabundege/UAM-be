import { Router } from "express";
import Controller from '../controller';
import { AuthCheck } from "../middlewares/authenticate";
import Validators from "../middlewares/validate";

const route:Router = Router()

route.get('/', Controller.WelcomeApi)
route.post('/signin', Validators.SignInValidation, Controller.Signin)
route.post('/signup', Validators.SignUpValidation, Controller.Signup)
route.post('/forgot-password', Validators.ForgotPassValidation, Controller.Forgot)
route.post('/reset-password', AuthCheck, Validators.ResetPassValidation, Controller.Reset)
route.get('/verify-token/:token', AuthCheck, Controller.validateToken)
route.get('/verify-account', AuthCheck, Controller.Verification)
route.get('/users', Controller.getAllUsers)

export default route
