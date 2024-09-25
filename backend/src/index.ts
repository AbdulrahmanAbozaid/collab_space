import app from "./config/app";
import { config } from "dotenv";
import connection from "./config/database";

config();

const port = process.env.PORT || 3000;

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
});

await connection();

app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});
