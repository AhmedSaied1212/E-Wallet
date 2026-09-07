const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./modules/auth/auth.routes");
const walletRoutes = require("./modules/wallet/wallet.routes");

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
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow during local development
        }
    },
    credentials: true
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallets", walletRoutes);

app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
