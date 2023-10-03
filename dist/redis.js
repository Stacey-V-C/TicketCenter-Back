"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const redis_1 = require("redis");
let client;
const getClient = async () => {
    if (!client) {
        client = (0, redis_1.createClient)({
            url: 'redis://localhost:7777',
            disableOfflineQueue: true,
        });
    }
    return client;
};
exports.getClient = getClient;
