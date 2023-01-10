#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/erp

#navigate into our working directory where we have all our github files
cd /home/ubuntu/erp/backend

sudo docker restart erp_api_1


#sudo docker-compose up -d --build