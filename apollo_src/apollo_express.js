const express = require('express');
const {ApolloServer,gql} = require('apollo-server-express');

const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type Author {
        name: String!
        nation: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        authors: [Author]
    }
`;

const authors = [
    {
        name: 'Shakespeare',
        nation: 'England',
    },
    {
        name: 'Xueqin Cao',
        nation: 'China',
    },
];

const resolvers = {
    Query: {
        authors: () => authors,
    },
};

async function startApolloServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();

    server.applyMiddleware({ app });

    app.use((req, res) => {
        res.status(200);
        res.send('Hello!');
        res.end();
    });

    await new Promise(resolve => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    return { server, app };
}

startApolloServer()