const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://messaging-web-app.donovanrowzee.net",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((error) => console.log(error));

app.use("/users", require("./routes/users"));
app.use("/messages", require("./routes/messages"));
app.use("/conversations", require("./routes/conversations"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
