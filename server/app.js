const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./modules/auth/auth.routes");
const walletRoutes = require("./modules/wallet/wallet.routes");
const transactionRoutes = require("./modules/transaction/transaction.routes");
const transferRoutes = require("./modules/transfer/transfer.routes");
const usersRoutes = require("./modules/users/users.routes");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
};

app.use(cors(corsOptions));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", walletRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", transferRoutes);

app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
