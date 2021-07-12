const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose');

const DB_PATH = 'mongodb://127.0.0.1:27017/hero_table'

const connect = () =>{
    mongoose.connect(DB_PATH,{ useNewUrlParser: true } )
    mongoose.connection.on('disconnected',()=>{
        mongoose.connect(DB_PATH)
    })
    mongoose.connection.on('err',()=>{
        console.log.error(err)
    })
    mongoose.connection.on('connected',async ()=>{
        console.log("Connected to MongoDB:" , DB_PATH)
    })
}

connect()

let HeroSchema = new mongoose.Schema({
    name: String,
    age: Number
})
let HeroModel = mongoose.model('hero',HeroSchema,'hero_table')

const schema = buildSchema(`
    input HeroInput{
        name: String
        age: Int
    }
    type Hero{
        name: String
        age: Int
    }
    type Mutation{
        createHero(input: HeroInput):Hero
        updateHero(hero:String!, input: HeroInput, ):Hero
    }
    type Query{
        hero:[Hero]
    }
`)

const root = {
    hero(){
        return new Promise((resolve, reject) => {
            HeroModel.find((err,res) =>{
                if(err){
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    },

    createHero({input}){
        const {name, age} = input
        const params = new HeroModel({name,age})
        return new Promise((resolve,reject) =>{
            params.save((err,res) => {
                if(err){
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    },

    updateHero({hero, input}){
        const {name,age} = input
        return new Promise((resolve,reject) => {
            HeroModel.updateOne({name:hero},{name,age},(err,res) => {
                if(err){
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
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