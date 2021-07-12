const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const schema = buildSchema(`
    input heroInput{
        name: String
        age: Int
    }
    type Hero{
        name: String
        age: Int
    }
    type Mutation{
        createHero(heroInfo:heroInput):Hero
        updateHero(heroName: String, heroInfo:heroInput):Hero
    }
    type Query{
        hero: [Hero]
    }
`)

const localDb = {}

const root = {
    hero() {
        // need to transfer to [] because hero will return an Array
        let arr = []
        for(const key in localDb){
            arr.push(localDb[key])
        }
        return arr
    },
    createHero({ input }) {
        // create
        localDb[input.name] = input
        return localDb[input.name]
    },
    updateHero({ id, input }) {
        // update
        const update = Object.assign({}, localDb[id], input)
        localDb[id] = update
        return update
    }
}

const app = express()
app.use('/graphiql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.use(express.static('public'))
app.listen(3001)
