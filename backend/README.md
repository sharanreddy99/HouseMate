#Create a .env file in this directory with the following env vars

PORT - port number for the server
PORT_LOCAL - port number for the local server (optional)
EMAIL - email id for the gmail account
PASSWORD - password for the gmail account
SECRETJWT - secret key for generating jwt tokens
MONGOURL - mongodb+srv://<username>:<password>@<cluster_address>/<collectioname>?retryWrites=true&w=majority (This is format for MongoDBAtlas)
MONGOURL_LOCAL = mongodb://localhost:27017/collection_name