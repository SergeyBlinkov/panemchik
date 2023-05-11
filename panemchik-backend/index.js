require("dotenv").config();

const express = require("express");
const sequelize = require("./database");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const router = require("./routes/routeStore");
const models = require("./models/models");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({ message: "working" });
});
app.use("/api", router);
app.use(express.static(path.resolve(__dirname, "static")));

app.use(errorHandler); //should be last %app.use% element

const start = async () => {
  try {
    const auth = await sequelize.authenticate();
    const sync = await sequelize.sync();

    app.listen(PORT, () =>
      console.log(
        `Server started on port ${PORT} and database on port : ${process.env.DB_PORT}`
      )
    );
    return Promise.all([auth, sync]);
  } catch (e) {
    console.error(e);
  }
};

start();
