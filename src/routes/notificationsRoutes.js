import express from "express";

import controllers from "../controllers/controller.js";

const router = express.Router();

// router.post("/sendExamCreatedNotification", controllers.sendMessageToKafka);

router.get(
  "/getNotifications/:userID",
  controllers.getNotifications
);

export default router;
