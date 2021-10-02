#!/bin/bash

# update base url
cd src/app/services
sed -i "s|HOUSEMATE_FRONTEND_BASEURL|$HOUSEMATE_FRONTEND_BASEURL|g" baseUrl.ts
cd ../../../

# up the server
if [[ $1 == "prod" ]];
then
    npm run build --prod
else
    npm run start
fi