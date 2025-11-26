"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoomParticipantsController_1 = require("../controllers/RoomParticipantsController");
const router = express_1.default.Router();
/* GET home page. */
router.post("v1/room-participants", RoomParticipantsController_1.getParticipants);
exports.default = router;
//# sourceMappingURL=api.js.map