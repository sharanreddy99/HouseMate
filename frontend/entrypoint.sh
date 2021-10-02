#!/bin/bash


# update env vars from .env file
if test -f "../.env"; 
then
    echo -e "\nUpdating the env variables in current environment:\n"
    echo -e   "--------------------------------------------------\n\n"
    eval $(cat ../.env | sed '/^#/ d' | sed '/^\s*$/d' | sed 's/^/export /')
    echo -e "Successful\n"
fi


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