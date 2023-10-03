"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
const router = express_1.default.Router();
const { Controller } = require("./controller");
const controller = new Controller((d) => d.initializeData(data_1.exampleTeamSettings, data_1.exampleUserSettings));
controller.refreshTickets();
router.get("/userData", async (req, res) => {
    const { userId } = req.query;
    const views = await controller.getUserData(userId);
    res.status(200).send({ views });
});
router.post("/userPlugins", async (req, res) => {
    const { userId, plugins } = req.body;
    await controller.setUserPlugins(userId, plugins);
    res.status(200).send({ success: true });
});
router.post("/teamPlugins", async (req, res) => {
    const { userId, plugins } = req.body;
    const { flags, team } = await controller.getUserSettings(userId);
    if (!flags.admin) {
        res.send({ success: false });
        return;
    }
    else {
        await controller.setTeamPlugins(team, plugins);
        res.status(200).send({ success: true });
    }
});
router.post("/tickets", async (_, res) => {
    await controller.refreshTickets();
    res.status(200).send({});
});
router.get("/users", (_, res) => {
    res.status(200).send({
        red: ["Admin Red", "Senior Red", "Junior Red"],
        blue: ["Admin Blue", "Senior Blue", "Junior Blue"],
    });
});
exports.default = router;
