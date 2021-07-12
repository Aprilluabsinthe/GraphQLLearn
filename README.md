# The learing process of GRAPHQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

---
# the learning process includes:


1. the usage of express and graphQL application

<a href="src/hello.js">Hello.js</a>
```
const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')
```
2. the link of front end to fetch graphql 

<a href="public/index.html">index.html</a>

3. connect to mongoDB database and CRUD

<a href="src/db.js">db.js</a>

---
# building process(Node.js)
```
npm init -y
npm install express graphql express-graphql -S
npm install nodemon
```
change 'start' configuration in ```package.json``` to ```nodemon```

in ```package.json``` you can edit enter point of the source file.

./src/db.js

./src/hello.js

# running

```
npm start
```

```nodemon``` will synchronize and update the project.

# visit GRAPHQL web application

```
http://localhost:3001/graphiql
```
![graphiql](static/graphql_app.png)

# start mongoDB

```
brew services start mongodb-community@4.4
```
![start_mongo](static/start_mongo.png)

mongo DB path:

```
const DB_PATH = 'mongodb://127.0.0.1:27017/hero_table'
```

## tools
** navicat **

collective GUI of database

![Navicat](static/navicat_mongodb.png)


## some queries
```mutation
mutation {
  createHero(input: {name: "Iron Man - Tony Stack", age: 55}) {
    name
    age
  }
}

mutation {
  updateHero(hero:"Iron Man - Tony Stack",input: {name: "Iron Man", age: 58}) {
    name
    age
  }
}

```

```query
query{
  hero{
    name
    age
  }
}
```

---

© Di Lu