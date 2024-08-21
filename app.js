require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pgRouter = require("./controllers/pgRouter");
const mongoRouter = require("./controllers/mongoRouter");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public"));

app.use("/api/pg", pgRouter);
app.use("/api/mongo", mongoRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App Listening on Port ${PORT}`);
});
