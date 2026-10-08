import express from "express";
import { studentsRrouter } from "./routes/students.routes.mjs";
import { teachersRouter } from "./routes/teacher.routes.mjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/students", studentsRrouter);
app.use("/teachers", teachersRouter);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
