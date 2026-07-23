require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", app: "Pallavi backend" });
});

app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Pallavi backend running on http://localhost:${PORT}`);
});
