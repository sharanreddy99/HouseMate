// Third Party Packages
const express = require("express");
const cors = require("cors");
const path = require("path");

// Global Setup
require("dotenv").config();
require("npm-atom").db;
require("./routers/automaticserver");

// Custom Packages
const middleware = require("npm-atom").middleware;
const defaultAuthRouter = require("npm-atom").auth;
const defaultEmailRouter = require("npm-atom").email;
const itemRouter = require("./routers/items");
const reminderRouter = require("./routers/reminder");

// Setup
// const ProjectURL = path.join(__dirname, "Housemates");
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static(ProjectURL));

app.use(middleware.InitAPILoggerMiddleware);
app.use("/api/auth/", defaultAuthRouter);
app.use("/api/email/", defaultEmailRouter);
app.use("/api", itemRouter);
app.use("/api", reminderRouter);

// app.get('/',(req,res)=>{
//     res.status(200).send("Hello Sharan Reddy")
// })
// app.get("*", function (req, res) {
//   res.sendFile(path.join(ProjectURL + "/index.html"));
// });

module.exports = app;
