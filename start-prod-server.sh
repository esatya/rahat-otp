#! /bin/bash
 
while true
do
# ((i++))
    if curl -If "http://rahat_server:3601/api/v1/app/settings"; then
        echo "rahat server is ready";
        yarn production;
        break;
    else
        echo "rahat server ain't ready";
        sleep 5;
    fi
done