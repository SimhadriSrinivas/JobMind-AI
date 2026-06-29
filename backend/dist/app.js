"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dns_1 = __importDefault(require("dns"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
dotenv_1.default.config();
dns_1.default.setServers(["8.8.8.8", "8.8.4.4"]);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// console.log(process.env.MONGODB_URI);
app.get("/", (_req, res) => {
    res.send("AI Job Agent Running");
});
app.get("/api/test", (_req, res) => {
    res.json({
        success: true,
        message: "JobMindAI Backend Running",
    });
});
app.use("/api/resume", resumeRoutes_1.default);
async function startServer() {
    if (!mongoUri) {
        console.error("MONGODB_URI is missing. Add it to backend/.env before starting the server.");
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("MongoDB Connection Failed");
        console.error(err);
        process.exit(1);
    }
}
startServer();
