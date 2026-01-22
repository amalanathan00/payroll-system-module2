const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const redisClient = require("./config/redis");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: "sess:"
    }),
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

// ============ ROUTES ============
// Module 1 Routes (from your friend)
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/org", require("./routes/org.routes"));

// Module 2 Routes (your work)
app.use("/api/statutory", require("./routes/statutory.routes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Payroll Backend API", 
    status: "running",
    module: "Module 2 - Statutory & Compliance"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
