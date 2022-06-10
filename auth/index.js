const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("./config/config");


const authRouter = require("./routes/authRoutes");

const app = express();

// TODO: change the name of the database
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/starter?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
// TODO: add CORS rules for development vs production
// TODO: remove global CORS *
// app.use(cors({ origin: '*' }));
app.use(cors({}));

app.use(express.json());

app.get("/api/auth", (req, res) => {
  res.send("<h2>Hi  There</h2>");
  console.log("yeah it ran");
});

//localhost:8000/api/auth
app.use("/api/auth", authRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
