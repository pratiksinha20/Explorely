const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Explorely Backend running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`
  );
  console.log(`📌 Health check available at: http://localhost:${PORT}/api/v1/health`);
});

// Connect to MongoDB in background
connectDB();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[UnhandledRejection] ${err.name}: ${err.message}`);
});

// Graceful shutdown on termination signals
const shutdown = () => {
  console.log("Shutting down Explorely server gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
