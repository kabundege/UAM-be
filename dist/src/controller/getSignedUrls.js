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
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("../config/aws");
const Responder_1 = require("../helpers/Responder");
class signedUrls {
    static getSignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key } = req.body;
                const bucket = 'uam-bucket-signed-urls';
                const signed = yield (0, aws_1.getObject)(bucket, key, 6000);
                return (0, Responder_1.SuccessResponse)(res, 200, "Signed url created", signed);
            }
            catch (error) {
                return (0, Responder_1.ErrorResponse)(res, 500, error.name, error.message);
            }
        });
    }
    static createSignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.body;
                const ext = String(type).split("/")[String(type).split("/").length - 1];
                const bucket = 'uam-bucket-signed-urls';
                const signed = yield (0, aws_1.getSignedUrl)(bucket, type, ext);
                return (0, Responder_1.SuccessResponse)(res, 200, "Signed url created", signed);
            }
            catch (error) {
                return (0, Responder_1.ErrorResponse)(res, 500, error.name, error.message);
            }
        });
    }
}
exports.default = signedUrls;
//# sourceMappingURL=getSignedUrls.js.map