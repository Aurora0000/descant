sudo apt-get install lsb-release
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/debian "$(lsb_release -sc)"/mongodb-org/3.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
echo "Fixing mongodb's issues with name"
sudo ln /etc/init.d/mongodb /etc/init.d/mongod
sudo apt-get install curl git build-essential openssl libssl-dev
sudo apt-get install mongodb-org
sudo curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install nodejs
sudo npm install -g bower grunt-cli express-generator express
