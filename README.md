# Requirements
1. [Docker](https://www.docker.com/)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. [Node & NPM](https://nodejs.org/en/)

# Usage
* Run `yarn run dev` it should download all necessary containers, create a network between them and expose necessary ports. First time running this command will take a while to finish since mariadb will be doing some inital configuration.
* To have it run in the background run `yarn run start`
* To stop it run `yarn run stop`
* All db files are stored locally on your computer in the db folder
* You can edit the `php.ini` file in `config/php.ini`

# Workflow
* Wordpress site is running on http://localhost:5050
* phpmyadmin is running on http://localhost:3535
  * username: `root`
  * password: `password`
* All plugin code is in the `src` folder any changes you make there should appear in on your local site.
