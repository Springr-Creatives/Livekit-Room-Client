import express from "express";
import { getParticipants } from "../controllers/RoomParticipantsController";

const router = express.Router();

// Ensure all API responses are marked as JSON
router.use((_req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

router.get("/v1/status", (_req, res) => {
  res
    .json({
      success: true,
    })
    .status(200);
});

/* GET home page. */
router.post("/v1/room/participants", getParticipants);

export default router;
