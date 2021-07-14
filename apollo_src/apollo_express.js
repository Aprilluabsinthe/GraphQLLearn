const express = require('express');
const {ApolloServer,gql} = require('apollo-server-express');

const libraries = [
    {
        branch: 'downtown'
    },
    {
        branch: 'riverside'
    },
];

// The branch field of a book indicates which library has it in stock
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
        branch: 'riverside'
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
        branch: 'downtown'
    },
];

// Schema definition
const typeDefs = gql`

    # A library has a branch and books
    type Library {
        branch: String!
        books: [Book!]
    }

    # A book has a title and author
    type Book {
        title: String!
        author: Author!
    }

    # An author has a name
    type Author {
        name: String!
    }

    # Queries can fetch a list of libraries
    type Query {
        libraries: [Library]
    }
`;

// Resolver map
const resolvers = {
    Query: {
        libraries() {

            // Return our hardcoded array of libraries
            return libraries;
        }
    },
    Library: {
        books(parent) {

            // Filter the hardcoded array of books to only include
            // books that are located at the correct branch
            return books.filter(book => book.branch === parent.branch);
        }
    },
    Book: {

        // The parent resolver (Library.books) returns an object with the
        // author's name in the "author" field. Return a JSON object containing
        // the name, because this field expects an object.
        author(parent) {
            return {
                name: parent.author
            };
        }
    }

    // Because Book.author returns an object with a "name" field,
    // Apollo Server's default resolver for Author.name will work.
    // We don't need to define one.
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