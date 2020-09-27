const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const port = 5000;

mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo databsae");
  })
  .catch((err) => console.log(err));

require("./models/user");
require("./models/post");

const authRouter = require("./routes/auth");
const postRoute = require("./routes/post");

app.use(express.json());
app.use(authRouter, postRoute);

app.listen(port, () => {
  console.log("Server is listen on port", port);
});
