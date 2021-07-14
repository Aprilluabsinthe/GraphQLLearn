const {gql} = require('apollo-server-express');

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

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        authors: () => authors,
    },
};