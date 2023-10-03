import express from "express";
const router = express.Router();
const { Controller } = require("./controller");

const controller = new Controller();

router.get("/userData/:userId", (req, res) => {
  const { userId } = req.params;
  const views = controller.getUserData(userId);

  res.status(200).send({ views });
})

router.post("/userPlugins", (req, res) => {
  const { userId, plugins } = req.body;
  controller.setUserPlugins(userId, plugins);

  res.status(200).send({ success: true });
})

router.post("/teamPlugins", (req, res) => {
  const { userId, plugins } = req.body;
  const { flags, team } = controller.getUserSettings(userId);

  if (!flags.admin) {
    res.send({ success: false });
    return;
  } else {
    controller.setTeamPlugins(team, plugins,);
    res.status(200).send({ success: true });
  }
});

router.post("/tickets", (_, res) => {
  controller.refreshTickets();
  res.status(200).send({});
});

router.get("/users", (_, res) => {
  controller.initializeData();
  res.status(200).send({
    red: ["Admin Red", "Senior Red", "Junior Red"],
    blue: ["Admin Blue", "Senior Blue", "Junior Blue"],
  });
});

export default router;
