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
exports.getSignedUrl = exports.getObject = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
// import { get, set } from "./redis";
const { AWS_ID, AWS_SECRET, AWS_REGION } = process.env;
aws_sdk_1.default.config.update({
    region: AWS_REGION,
    signatureVersion: "v4",
    credentials: {
        accessKeyId: AWS_ID,
        secretAccessKey: AWS_SECRET,
    }
});
const S3 = new aws_sdk_1.default.S3({ apiVersion: "2006-03-01" });
const getObject = (Bucket, Key, Expires, Region) => __awaiter(void 0, void 0, void 0, function* () {
    // const cachedUri = await get(Key);
    // if (cachedUri) {
    //   return cachedUri;
    // }
    const uri = S3.getSignedUrl("getObject", { Bucket, Key, Expires });
    // await set(Key, uri);
    return uri;
});
exports.getObject = getObject;
const getSignedUrl = (Bucket, ContentType, extension) => __awaiter(void 0, void 0, void 0, function* () {
    const Key = `${(0, uuid_1.v4)()}.${extension}`;
    const params = {
        Key,
        Bucket,
        ContentType,
        Expires: 21600,
    };
    const signedUrl = yield S3.getSignedUrlPromise("putObject", params);
    return {
        url: signedUrl,
        Key,
    };
});
exports.getSignedUrl = getSignedUrl;
//# sourceMappingURL=aws.js.map