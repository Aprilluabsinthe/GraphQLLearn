const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const schema = buildSchema(`
    type User {
        # can add commit here
        name: String
        age: Int
    }
    type Wallet{
        id: String
        balance: Float
        valid: Boolean
    }
    type Writer{
        name: String
        nation:String
        age: Int
        introduce(bookName: String!): String
    }
    type Hero{
        name: String
        age: Int
    }
    
    type Query {
        hero: [Hero]
        user: User
        wallet: Wallet
        getHero(teamName: String!, number: Int): [String]
        getWriter(writerName:String!): Writer
    }
    input heroInput{
        name: String
        age: Int
    }
    type Mutation{
        createHero(heroInfo:heroInput):Hero
        updateHero(heroName: String, heroInfo:heroInput):Hero
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
    createHero({ heroInfo }) {
        // create
        localDb[heroInfo.name] = heroInfo
        return localDb[heroInfo.name]
    },
    updateHero({ heroName, heroInfo }) {
        // update
        const update = Object.assign({}, localDb[heroName], heroInfo)
        localDb[heroName] = update
        return update
    },
    user: () => {
        return {
            name: 'leo',
            age: 18
        }
    },
    wallet:() => {
        return {
            id: '135768',
            balance: 101.35,
            valid: true
        }
    },
    getHero: ({teamName}) => {
        const hero = {
            'Three Kingdom': ['Zhang Fei', 'Liu Bei', 'Guan Yu'],
            'Avatar': ['Iron man', 'Captain USA', 'Haluk']
        }
        return hero[teamName]
    },
    getWriter: ({writerName}) => {
        const name = writerName
        const nation = "China"
        const age = "55"
        const introduce = ({bookName}) => {
            return `The writer is ${name}, He is ${age} years old, He is from ${nation}, He has a book called ${bookName}.`
        }
        return {name, nation,age, introduce}
    }
}

const app = express()
const middleWare = (req,res,next) =>{
    if(req.url.indexOf('/graphiql') !== -1 && req.headers.cookie.indexOf('auth') === -1){
        res.send(JSON.stringify({err:"You do not have this authority"}))
        return
    }
    else{
        next()
    }
}

app.use(middleWare)

app.use('/graphiql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.use(express.static('public'))
app.listen(3001)