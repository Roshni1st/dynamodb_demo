const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const routes = require("./routes/route");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on port:${port}`);
});
module.exports = app;
