NodeJS base REST API model
=================

1. #### Import your model

- Get a local copy of this model
```
git clone https://github.com/maclaude/node-js-model-rest-api.git

# OR (with SSH)

git clone git@github.com:maclaude/node-js-model-rest-api.git
```

2. #### Copy the model inside your new project repository

- At the root directory where your `node-js-model-rest-api` folder is located, clone your project repository.
- Go to your project repository
```
cd project-repository
```
- Execute the following commands to copy folders / files / hidden files inside your project folder

```
# Recursive copy of the model folder
cp -R ../node-js-model-rest-api/ .
```

3. #### Install the dependencies

- `yarn`

4. #### Start the server

- `yarn start`
 
5. __Your are good to go__ :v:

## Model dependencies

**Framework**
- [Express.js](https://www.npmjs.com/package/express)

**Database**
- [Mongoose](https://www.npmjs.com/package/mongoose)

**Parsing request**
- [bodyParser](https://www.npmjs.com/package/body-parser)

**Envrionnement variable**
- [dotenv](https://www.npmjs.com/package/dotenv)

**File management**
- [multer](https://www.npmjs.com/package/multer)

**Encryption**
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

**Token**
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

**Validation**
- [express-validator](https://express-validator.github.io/docs/)

**Linter**
- [eslint [airbnb-base]](https://eslint.org/)
- [prettier](https://prettier.io/)

**WebSockets**
- [socket.io ](https://socket.io/docs/)

**Other**
- [nodemon](https://www.npmjs.com/package/nodemon)
- [uuidv4](https://www.npmjs.com/package/uuid)
