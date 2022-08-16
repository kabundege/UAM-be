"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = exports.ResetPass = exports.ForgotPass = exports.CreateObject = exports.GetObject = exports.SignIn = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const enumtoArray_1 = require("../helpers/enumtoArray");
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus[MaritalStatus["SINGLE"] = 0] = "SINGLE";
    MaritalStatus[MaritalStatus["MARRIED"] = 1] = "MARRIED";
    MaritalStatus[MaritalStatus["DIVORCED"] = 2] = "DIVORCED";
    MaritalStatus[MaritalStatus["WIDOWED"] = 3] = "WIDOWED";
})(MaritalStatus || (MaritalStatus = {}));
exports.SignIn = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.GetObject = joi_1.default.object({
    key: joi_1.default.string().required(),
});
exports.CreateObject = joi_1.default.object({
    type: joi_1.default.string().required(),
});
exports.ForgotPass = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.ResetPass = joi_1.default.object({
    password: joi_1.default.string().required(),
});
exports.SignUp = joi_1.default.object({
    profilePhoto: joi_1.default.string().required(),
    name: joi_1.default.string().pattern(/^[a-zA-Z0-9 *]{3,25}$/).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    age: joi_1.default.string().required(),
    national_id: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    document: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.string().required(),
    maritalStatus: joi_1.default.string().valid(...(0, enumtoArray_1.enumToArray)(MaritalStatus)).required(),
    nationality: joi_1.default.string().required(),
});
//# sourceMappingURL=auth.js.map