"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Responder_1 = require("../helpers/Responder");
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailer_1 = require("../helpers/mailer");
const Code_1 = __importDefault(require("../Models/Code"));
class Auth {
}
exports.default = Auth;
_a = Auth;
Auth.WelcomeApi = (_, res) => {
    //
    return (0, Responder_1.SuccessResponse)(res, 200, 'Welcome to UAM Backend');
};
Auth.getAllUsers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.default.find().exec()
        .then(users => {
        return (0, Responder_1.SuccessResponse)(res, 200, 'Fetch Success', users);
    })
        .catch(error => {
        return (0, Responder_1.ErrorResponse)(res, 500, error);
    });
    //
});
Auth.validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    console.log('======', params);
    //
    return (0, Responder_1.SuccessResponse)(res, 200, 'Token is valid', req.userData);
});
Auth.Signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email }).exec();
        if (!user) {
            return (0, Responder_1.ErrorResponse)(res, 400, 'Invalid Credentials');
        }
        if (!(yield bcryptjs_1.default.compare(password, user.password))) {
            return (0, Responder_1.ErrorResponse)(res, 400, 'Invalid User Credentials');
        }
        const { phoneNumber, _id: userId } = user;
        const token = jsonwebtoken_1.default.sign({ email, phoneNumber }, process.env.JWT_SECRET);
        const existingCode = yield Code_1.default.findOne({ userId }).exec();
        // if there's an existing code delete it;
        if (existingCode)
            yield Code_1.default.deleteOne({ id: existingCode._id }).exec();
        // Part 2 ~ Confirm Account Creation
        const min = 100000, max = 999999;
        const code = Math.floor(Math.random() * (max - min) + min);
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
        yield (0, mailer_1.SendEmail)(req.body.email, 'UAM ~ Account Verification', html);
        /** save the code & associate with user by id */
        const codePayload = new Code_1.default({ userId, code });
        yield codePayload.save();
        res.cookie('token', token);
        return (0, Responder_1.SuccessResponse)(res, 200, 'Signin Successful', { token });
    }
    catch (error) {
        return (0, Responder_1.ErrorResponse)(res, 500, error);
    }
});
Auth.Reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
        const user = yield User_1.default.findOne({ email: req.userData.email }).update({ password: hashedPassword }).exec();
        return (0, Responder_1.SuccessResponse)(res, 200, 'Reset Successful', user);
    }
    catch (error) {
        return (0, Responder_1.ErrorResponse)(res, 500, error);
    }
});
Auth.Forgot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email }).exec();
        if (!user)
            return (0, Responder_1.ErrorResponse)(res, 404, 'User Does not exist');
        const { phoneNumber } = user;
        const token = jsonwebtoken_1.default.sign({ email, phoneNumber }, process.env.JWT_SECRET);
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
            `;
        yield (0, mailer_1.SendEmail)(email, 'UAM ~ Reset Password', html);
        return (0, Responder_1.SuccessResponse)(res, 200, 'Sent Email Successful');
    }
    catch (error) {
        return (0, Responder_1.ErrorResponse)(res, 500, error);
    }
});
//# sourceMappingURL=index.js.map