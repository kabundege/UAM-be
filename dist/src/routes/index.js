"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("../controller"));
const getSignedUrls_1 = __importDefault(require("../controller/getSignedUrls"));
const authenticate_1 = require("../middlewares/authenticate");
const validate_1 = __importDefault(require("../middlewares/validate"));
const route = (0, express_1.Router)();
const { SignInValidation, ForgotPassValidation, ResetPassValidation, GetObjectValidation, CreateObjectValidation } = validate_1.default;
/** User APIs */
route.get('/', controller_1.default.WelcomeApi);
route.post('/signin', SignInValidation, controller_1.default.Signin);
route.post('/forgot-password', ForgotPassValidation, controller_1.default.Forgot);
route.post('/reset-password', authenticate_1.AuthCheck, ResetPassValidation, controller_1.default.Reset);
route.get('/verify-token/:token', controller_1.default.validateToken);
route.get('/users', controller_1.default.getAllUsers);
/** Signed Url APIs */
route.post('/get-signed-urls', GetObjectValidation, getSignedUrls_1.default.getSignedUrl);
route.post('/create-signed-urls', CreateObjectValidation, getSignedUrls_1.default.createSignedUrl);
exports.default = route;
//# sourceMappingURL=index.js.map