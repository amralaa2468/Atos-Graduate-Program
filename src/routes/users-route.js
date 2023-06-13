import express from "express";
import usersController from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", usersController.getDecodedToken);

router.post("/admin-token", usersController.getAdminToken);

router.get("/students", usersController.getStudents);

export default router;
