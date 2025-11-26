"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Force JSON responses for every request
app.use((_req, res, next) => {
    res.type("application/json");
    next();
});
app.get("/", (_req, res) => {
    res.json({ message: "Hello World" });
});
// mount all API routes under the /api prefix
app.use("/api", api_1.default);
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, _next) {
    const status = err.status || 500;
    const payload = {
        success: false,
        message: err.message || "Internal Server Error",
        status,
    };
    if (req.app.get("env") === "development" && err.stack) {
        payload.stack = err.stack;
    }
    res.status(status).json(payload);
});
exports.default = app;
//# sourceMappingURL=app.js.map