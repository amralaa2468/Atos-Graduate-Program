import createKafkaConfig from "../middleware/config.js";
import { Notification } from "../models/notifications.js";
import HttpError from "../models/http-error.js";

const getAndSaveMessageFromKafka = async (req, res) => {
  try {
    const kafkaConfig = createKafkaConfig();

    kafkaConfig.consume("first_kafka_topic", async (value) => {
      const message = JSON.parse(value);
      console.log("message: " + message);

      const newNotification = new Notification({ message });

      try {
        await newNotification.save();
      } catch (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong, could not save notification.",
          500
        );
        return next(error);
      }
    });
  } catch (err) {
    console.log("error: " + err);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while consuming the message from Kafka",
    });
  }
};

async function getNotifications(req, res, next) {
  const { userID } = req.params;
  let notifications;

  try {
    notifications = await Notification.find({ "message.assignedUser": userID });
  } catch (err) {
    const error = new HttpError(
      "Fetching notifications failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ notifications: notifications });
}

const controllers = { getAndSaveMessageFromKafka, getNotifications };

export default controllers;
