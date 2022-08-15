"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./src/app"));
const logging_1 = __importDefault(require("./src/config/logging"));
const server = http_1.default.createServer(app_1.default);
const port = Number(process.env.PORT) || 2000;
const networkInterfaces = os_1.default.networkInterfaces();
const LocalIP = networkInterfaces['lo0'][0].address;
const LanIp = networkInterfaces['en0'][1].address;
const LanPort = `${LanIp}:${port}`;
const NAMESPACE = "Initializer";
server.listen(port, () => {
    logging_1.default.info(NAMESPACE, `Server is running ${LocalIP}`);
    logging_1.default.info(NAMESPACE, `Server is running ${LanPort}`);
});
//# sourceMappingURL=index.js.map