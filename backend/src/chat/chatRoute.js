import express from "express";
import { chat, getHistory, getAllSessions } from "./chatController.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.post("/chat", authenticateUser, chat);
chatRouter.get("/chat/history", authenticateUser, getHistory);
chatRouter.get("/chat/sessions", authenticateUser, getAllSessions);

export default chatRouter;
