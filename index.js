import { server } from "./src/socket/socket.js";

const onCloseSignal = () => {
  console.info("sigint received, shutting down");
  server.close(() => {
    console.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
