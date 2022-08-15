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
exports.set = exports.get = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redis.get(key);
    return result ? JSON.parse(result) : null;
});
exports.get = get;
const set = (key, value, exp) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redis.setex(key, exp || 86400, JSON.stringify(value));
    return result;
});
exports.set = set;
//# sourceMappingURL=redis.js.map