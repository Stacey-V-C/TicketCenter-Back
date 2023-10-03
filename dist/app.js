"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173'
}));
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use(router_1.default);
app.listen(3333, () => {
    console.log('Server started on port 3333');
});
