#!/bin/bash


# update env vars from .env file
if test -f "../.env"; 
then
    echo -e "\nUpdating the env variables in current environment:\n"
    echo -e   "--------------------------------------------------\n\n"
    eval $(cat ../.env | sed '/^#/ d' | sed '/^\s*$/d' | sed 's/^/export /')
    echo -e "Successful\n"
fi



# replace default env var names by current env var names 
echo -e "\nReplacing the env variables of npm-atom\n"
echo -e   "---------------------------------------\n\n"
cd node_modules/npm-atom/db
sed -i "s|NPM_ATOM_DATABASE_URL|$HOUSEMATE_DATABASE_URL|g" migrate-mongo-config.js
sed -i "s|NPM_ATOM_DATABASE_NAME|$HOUSEMATE_DATABASE_NAME|g" migrate-mongo-config.js
cd ../
find ./ -type f -exec sed -i "s|NPM_ATOM_|HOUSEMATE_|g" {} \;
cd ../../
echo -e "Successful\n"




# run migrations of npm-atom
echo -e "\nRun migrations of npm-atom\n"
echo -e   "--------------------------\n\n"
cd node_modules/npm-atom/db
npx migrate-mongo up
cd ../../../
echo -e "Successful\n"



echo -e "\Updating migration configuration for housemate\n"
echo -e   "---------------------------------------------\n\n"
cd src/db
sed -i "s|HOUSEMATE_DATABASE_URL|$HOUSEMATE_DATABASE_URL|g" migrate-mongo-config.js
sed -i "s|HOUSEMATE_DATABASE_NAME|$HOUSEMATE_DATABASE_NAME|g" migrate-mongo-config.js
cd ../../
echo -e "Successful\n"



# run migrations of housemate
echo -e "\nRun migrations of housemate\n"
echo -e   "---------------------------\n\n"
cd src/db
npx migrate-mongo up
cd ../../
echo -e "Successful\n"


if [[ $1 == "rollback" ]];
then

    echo -e "\nundo migrations of housemate\n"
    echo -e   "----------------------------\n\n"
    cd src/db
    MIGRATIONS_FILE_COUNT=$(ls migrations | wc -l)
    for i in $(seq 1 $MIGRATIONS_FILE_COUNT);
    do
        npx migrate-mongo down
    done
    cd ../../
    echo -e "Successful\n"
    
    echo -e "\nundo migrations of npm-atom\n"
    echo -e   "---------------------------\n\n"
    cd node_modules/npm-atom/db
    MIGRATIONS_FILE_COUNT=$(ls migrations | wc -l)
    for i in $(seq 1 $MIGRATIONS_FILE_COUNT);
    do
        npx migrate-mongo down
    done
    cd ../../../
    echo -e "Successful\n"
fi

# up the server
if [[ $1 == "prod" ]];
then
    cd src
    sed -i "s|HOUSEMATE_BACKEND_FILE_NAME|./app_container|g" index.js
    cd ..
else
    cd src
    sed -i "s|HOUSEMATE_BACKEND_FILE_NAME|./app|g" index.js
    cd ..
fi
nodemon src/index.js