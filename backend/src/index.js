// Custom Packages
const app = require("./app");
const port = process.env.HOUSEMATE_NODE_PORT;
const redisClient = require("npm-atom").redis.client;
const logger = require("npm-atom/logger");
const constants = require("npm-atom/constants");

redisClient.on("ready", (err) => {
  app.listen(port, (err) => {
    if (err) {
      console.log("Error Occured...");
      logger.LogMessage(null, constants.LOG_ERROR, err.message);
      process.exit(1);
    }

    console.log("Server is Running on Port: ", port);
    console.log("URL for MONGODB is: ", process.env.MONGODB_URL);
    logger.LogMessage(
      null,
      constants.LOG_DEBUG,
      "Server is running on Port: " + port
    );
  });
});
