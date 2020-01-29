
# Votechain
**A simple web based app for utilizing the power of blockchain  in a secured way which provides ability to vote with/without availability of the internet connectivity.**

 >1. With the use of azure blockchain and deployment of smart-contracts a simple web-app can be made with other dependencies >like web3 or with the provided swagger-api or with azure blockchain workbench which can be used with internet connectivity >present.

 >2. The other part(without internet connectivity) is be covered with the help of raspberry pi and creation of local server in >the area where the network connectivity is not present. In this case  the votes given by the people is stored in the >distributive single node ethereum and transferred to main network when it comes in contact with internet.

 >3. Two Factor Authentication With AES and SHA512 Encryption which allow users to register with a device and a pin and login >through that specific combination of pin and Device Hardware descriptor.
# Installation

>Clone Repo

    git clone https://github.com/Wolverin-e/Votechain.git Votechain
##
Use Node v10.18.0 and Install dependencies

    nvm install 10.18.0
    nvm use 10.18.0
    cd ./Votechain && npm install
##
>Use docker-compose to to start required services.

>Install docker from [HERE](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

>Install docker-compose from [HERE](https://docs.docker.com/compose/install/).

	cd ./DC_Services
	sudo docker-compose up
##
>Copy .env.rc file 

	cd ../
	cp .env.rc.json.example .env.rc.json
	
	# Edit in case of different server name and api calls.
	nano .env.rc.json
##
>Run Using npm commands in the `Votechain` Directory

>Development Server(Open Chrome in disabled security mode-CORS).

    # Run web-server
    npm run web-server
    
    # Run api-server
    npm run api-server

	# Run admin-server
	npm run admin-server

	# Run admin-api-server
	npm run admin-api-server

>Production Server(CORS Headers added by default).

	--------------------------------------------
	# Make production optimised build
	--------------------------------------------
	
	# Web_Portal
	cd ./Web_Portal
	npm run build
	
	#Admin
	cd ./Admin
	npm run build
	
	--------------------------------------------
	# Edit Service files and Script files for proper path configuration.
	--------------------------------------------
	
	# copy Deploy_Scripts(Service Files)
	./Deploy_Scripts/services/copier.sh

	# copy ganache-cli script in case of Raspberry-pi(Ganache-cli service)
	./Deploy_Scripts/rasp-services/copier.sh
	
	# Install mysql-server manually in case of Raspberry-pi
	
	--------------------------------------------

	# Run web-server
	sudo service web-server start

	# Run api-server
	sudo service api-server start

	# Run admin-server
	sudo service admin-server start
	
	# Run admin-api server
	sudo service admin-api-server start
	
	--------------------------------------------
	# Check service logs using journalctl
	--------------------------------------------
	
	sudo journalctl -u <service-name> -f(for active logs)
	
	sudo journalctl -u <service-name> -n <no-of-lines-to-view>
	
	--------------------------------------------
