import express from "express";
import { DAO } from "./db";
import { exampleTeamSettings, exampleUserSettings } from "./data";
const router = express.Router();
const { Controller } = require("./controller");

const controller = new Controller((d: DAO) => d.initializeData(exampleTeamSettings, exampleUserSettings));

controller.refreshTickets();

router.get("/userData", async (req, res) => {
  const { userId } = req.query;
  const views = await controller.getUserData(userId);

  res.status(200).send({ views });
})

router.post("/userPlugins", async (req, res) => {
  const { userId, plugins } = req.body;
  await controller.setUserPlugins(userId, plugins);

  res.status(200).send({ success: true });
})

router.post("/teamPlugins", async (req, res) => {
  const { userId, plugins } = req.body;
  const { flags, team } = await controller.getUserSettings(userId);

  if (!flags.admin) {
    res.send({ success: false });
    return;
  } else {
    await controller.setTeamPlugins(team, plugins,);
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

export default router;
