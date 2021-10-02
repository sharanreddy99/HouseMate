// Custom Packages
const app = require("HOUSEMATE_BACKEND_FILE_NAME");
const port = process.env.HOUSEMATE_PORT;
const redisClient = require("npm-atom").redis.client;
const logger = require("npm-atom/logger");
const constants = require("npm-atom/constants");

redisClient.on("ready", (err) => {
  app.listen(port, (err) => {
    if (err) {
      logger.LogMessage(null, constants.LOG_ERROR, err.message);
      process.exit(1);
    }

    logger.LogMessage(
      null,
      constants.LOG_DEBUG,
      "Server is running on Port: " + port
    );
  });
});
