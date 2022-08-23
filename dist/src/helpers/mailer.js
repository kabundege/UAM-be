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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logging_1 = __importDefault(require("../config/logging"));
const user = process.env.EMAIL;
const pass = process.env.PASSWORD;
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.outlook.com',
    auth: { user, pass }
});
const SendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: user,
        to,
        subject,
        html // plain text body
    };
    return new Promise((res, rej) => {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                rej(logging_1.default.error('NodeMailer', err.message, err));
            else
                res(logging_1.default.info('NodeMailer', info.response, info));
        });
    });
});
exports.SendEmail = SendEmail;
//# sourceMappingURL=mailer.js.map