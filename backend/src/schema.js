const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        id: Int!
        login: String!
    }

    type Product {
        id: Int!
        name: String!
        brand: String
        price: Float
    }

    type Query {
        current: User
        product(id: Int!): Product
        products(brand: String!): [Product]
    }

    type Mutation {
        register(login: String!, password: String!): String
        login(login: String!, password: String!): String
    }
`;

module.exports = typeDefs;