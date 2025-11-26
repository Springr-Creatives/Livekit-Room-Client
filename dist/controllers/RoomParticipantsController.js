"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipants = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const Validator_1 = require("../validators/Validator");
const getParticipants = async (req, res) => {
    // Validate request body using Laravel-style validator
    const validation = (0, Validator_1.validateRequest)(req, res, {
        host: "required|string|url",
        key: "required|string|min:1",
        secret: "required|string|min:1",
        roomName: "required|string|min:1",
    });
    if (!validation) {
        return; // Validation failed, response already sent
    }
    const { host, key, secret, roomName } = validation.validated;
    let participants = [];
    try {
        let roomServiceClient = new livekit_server_sdk_1.RoomServiceClient(host, key, secret);
        participants = await roomServiceClient.listParticipants(roomName);
    }
    catch (error) {
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
exports.getParticipants = getParticipants;
//# sourceMappingURL=RoomParticipantsController.js.map