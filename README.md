

## Description

Chat application developed using [Nest](https://github.com/nestjs/nest) framework and TypeScript

## Code Repository
Clone the code from [This Repository](https://github.com/toseef-ahmd/chat-app-backend) using the commmand

```bash
$ git clone https://github.com/toseef-ahmd/chat-app-backend
```
## Installation
After you have cloned the repository, Navigate to chat-app-backend using

```bash
$ cd chat-app-backend
```

Run

```bash
$ npm install
```
This will install the dependencies as defined in **_Package.json_** file.

## Running the app

As of now, we have only created the Database schema, so you do not need to run the entire application. We have provided a **dbdump.js** file which you can use to populate data into MongoDB.

In order to create the database and dump data into collections, you need following tools.

1.  MongoDB Client. (Installed when you run ```npm install```)
2.  Docker. [(Here)](https://www.docker.com/products/docker-desktop/#)
3.  Docker Compose file. (Provided in the code repository.)
4.  **dbdump.js** file. (Provided in the root directory of the code repository.)
5.  MonngoDB Compass [(Here)](https://www.mongodb.com/try/download/compass) or Studio 3T [(Here)](https://studio3t.com/download/)

Once you are in the root directory of the project, run

```bash
$ docker-compose up -d
```
This will setup a database in the docker container.

Once it is created, run

```bash
$ node dbdump.js
```

Open MongoDB Compass or Studio 3T (Whichever you have downloaded), and create a new connection using following parameters.

1.  **Host:** localhost
2.  **PORT:** 27017
3.  **DB_NAME:** chatapp
4.  **username:** rootuser
5.  **password:** rootpass

Here is the connection string that you may use in the connection manager.

```bash
$  mongodb://rootuser@localhost:27017/admin
```

Once you are logged in, you would be able to view the collections and data inside them.

## License

Nest is [MIT licensed](LICENSE).
