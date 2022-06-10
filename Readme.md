# Intro

This is a skeleton or a quick start for a web development project using a simple microservices architecture. The project includes:
* docker-compose configuration to run the dev environment and production environment
* development environments on-demand (no need to install node, mongo, vue, etc)
* A web gateway with auto SSL (Caddy)
* A mongo database
* An example auth service
* A starter web client with Vuetify, Vue, Vuex, and Vue Router
* A test smtp server
* Bad documentation

### Setup dev environment

1. From your command-line, clone the main repository

        git clone (url) (folder-name)

2. Create a mongo-db volume

        docker volume create mongo-db

3. Create a .env file with at minimum a TOKEN_SECRET

4. Start up the docker dev environment

        docker-compose up -d

5. Follow the logs of whatever you're working on

        docker logs foldername-service-1 --follow

    example:

        docker logs foldername-webui-1 --follow

6. Open your local browser to http://localhost:8000

7. If you need to look in the database, in a new terminal run:

        docker exec -it foldername-mongo-1 mongosh
        use admin
        db.auth('devuser','devpassword')
        

### .env file 

For production the env file will need:

    PORT=
    EMAIL_PASSWORD=
    MONGO_USER=
    MONGO_PASSWORD=
    TOKEN_SECRET=
