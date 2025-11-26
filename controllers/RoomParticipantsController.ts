import { Request, Response } from "express";
import { ParticipantInfo, RoomServiceClient } from "livekit-server-sdk";
import { validateRequest } from "../validators/Validator";

const getParticipants = async (req: Request, res: Response): Promise<void> => {
  // Validate request body using Laravel-style validator
  const validation = validateRequest(req, res, {
    host: "required|string|url",
    key: "required|string|min:1",
    secret: "required|string|min:1",
    roomName: "required|string|min:1",
  });

  if (!validation) {
    return; // Validation failed, response already sent
  }

  const { host, key, secret, roomName } = validation.validated;
  let participants: ParticipantInfo[] = [];
  try {
    let roomServiceClient = new RoomServiceClient(host, key, secret);
    participants = await roomServiceClient.listParticipants(roomName);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Failed to fetch participants",
    });
    return;
  }

  res.json({
    success: true,
    participants: participants.map((participant) => ({
      identity: participant.identity,
      name: participant.name,
    })),
  });
};

export { getParticipants };
