# HouseMate

An application which keeps tracks of the inventory of a user and informs the user when the stock of items get low. It also gives an estimation of the items to be purchased on the next visit.

## Features

- The user can keep track of the items he needs and can visualize the availability of items using graphs.
- The user will be notified periodically with the items that are low on stock both in app and via email.
- The user can also check the details of the items they need to purchase to refill their inventory
- The user can also add other reminders which will be notified accordingly.

### Technologies Used

- **MEAN Stack**
- **Docker**

## Installation

#### Docker and Docker-Compose

1. Create an `.env` file with the following values at the root directory. Fields marked with `!!!` shouldn't be changed

   | Variable Name                   | Description                                                                          | Example                                                                                                   |
   | ------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
   | **HOUSEMATE_CRYPTO_PASSPHRASE** | secret_key with atleast 32 characters long                                           | `ciw7p02f70000ysjon7gztjn7c2x7GfJ`                                                                        |
   | **HOUSEMATE_DATABASE_URL**      | The mongodb database url of format `mongodb://[username:password@]host:port/db_name` | `mongodb://mongo:27017/housematedb` !!!                                                                   |
   | **HOUSEMATE_DATABASE_NAME**     | name of the database which must be same as the one specified in the url              | `housematedb` !!!                                                                                         |
   | **HOUSEMATE_APP_NAME**          | name of the appplication                                                             | `housemate`                                                                                               |
   | **HOUSEMATE_REDIS_HOST**        | host name for redis                                                                  | `redis` !!!                                                                                               |
   | **HOUSEMATE_REDIS_PORT**        | port number of redis                                                                 | `6379`                                                                                                    |
   | **HOUSEMATE_EMAIL**             | Email-ID which should be used for sending reminders and otps.                        | `sharan.personal.projects@gmail.com`                                                                      |
   | **HOUSEMATE_CLIENT_ID**         | Client ID obtained by registering our application with OAuth-2.0                     | `473358254690-9skipcr4jkou8b15gq6llmv727c484u0.apps.googleusercontent.com`                                |
   | **HOUSEMATE_CLIENT_SECRET**     | Client Secret obtained by registering our application with OAuth-2.0                 | `9zT_fElCgfKMxE94dsPLa3kd`                                                                                |
   | **HOUSEMATE_REFRESH_TOKEN**     | Refresh Token obtained by registering our application with OAuth-2.0                 | `1//0468tLAM6E5GhCgYIARAAGAQSNwF-L9IrlF57TcXksoDoPpynebZTtoHqRG8QB7FtCzr2sJCfaX-UYb2TQTBCJc7wc74pcfTwOjk` |
   | **HOUSEMATE_PORT**              | The port at which you want the node server to run                                    | `4201`                                                                                                    |
   | **HOUSEMATE_MONGO_FE_PORT**     | for accessing the mongodb database using GUI                                         | `8085`                                                                                                    |
   | **HOUSEMATE_FRONTNED_BASEURL**  | for accessing the apis from frontend                                                 | `/api` !!!                                                                                                |

2. run `docker-compose up`

3. Access the different services of the application using the following urls. The port numbers are usd from the deafult env vars specified above.
   > app: http://localhost:4201/
   > mongo_gui: http://localhost:8085/
