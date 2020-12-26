const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const mongoURI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const { v1: uuid } = require('uuid')
const author = require('./models/author')
const myPlugin = {

    // Fires whenever a GraphQL request is received from a client.
    requestDidStart(requestContext) {

        return {

            // Fires whenever Apollo Server will parse a GraphQL
            // request to create its associated document AST.
            parsingDidStart(requestContext) {
                console.log('Parsing started!');
            },

            // Fires whenever Apollo Server will validate a
            // request's document AST against your GraphQL schema.
            validationDidStart(requestContext) {
                console.log('Validation started!');
            },

        }
    },
};
mongoose.set('useCreateIndex', true)

console.log('connecting to', mongoURI)

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const typeDefs = gql`
type Book {
    title: String!
    published: Int!
    author : Author!
    genres: [String]!
    id: ID!
}
type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
}

  type Query {
      bookCount : Int!
      authorCount: Int!
      allBooks(author: String genre: String): [Book!]!
      allAuthors: [Author!]!
  }
 type Mutation {
    addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]!
    ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    addAuthor(
        name: String!
        born: Int
    ): Author
  }
`

const resolvers = {
    Query: {
        bookCount: async () => (await Book.find({})).length,
        authorCount: async() => await Author.find({}).length,
        allAuthors: async() => await Author.find({}),
        allBooks: (root, args) => {
            try{

                console.log("All books with args?",args)
                if (args.author) {
                    console.log("let me out")
                    returnArray = returnArray.filter(book => book.author === args.author)
                }
                if (args.genre) {
                    return Book.find({ genres: { $in: args.genre } }).populate("author")
                }
                return Book.find({}).populate("author")
            }catch(err){
                console.log(err)
            }
        }
    },
    Author: {
        bookCount: (root) => {
            let authorID = Author.findOne({ name: root.name })
            if (!authorID) {
                //This should not be possible
                return null
            }
            return (
                Book.find({ author: authorID }).length
                //books.filter(book => book.author === root.name).length
            )
        }

    },
    Mutation: {
        addAuthor: async (root, args) => {
            try {
                console.log("adding author", args)
                const author = new Author({ ...args })
                console.log("Made a new author")
                await author.save()
                console.log("And saved it")
                return author
            } catch (err) {
                console.log(err)
                throw new UserInputError(err.message, {
                    invalidArgs: args
                })
            }
        },
        addBook: async (root, args) => {
            try {
                console.log("adding book")
                let author = await Author.findOne({ name: args.author })
                if (!author) {
                    console.log("no auth found")
                    author = new Author({ name: args.author })
                    await author.save()
                }
                console.log("Creating a book with author", author)
                const book = new Book({ ...args, author: author })
                await book.save()
                return book
            } catch (err) {
                throw new UserInputError(err.message, {
                    invalidArgs: args
                })
            }
        },
        editAuthor:async (root, args) => {
            try {

                console.log("Updating author", args)
                const author = await Author.findOne({ name: args.name })
                if (!author) {
                    console.log("No author found")
                    return null
                }
                console.log("Author found",author)
                author.born = args.setBornTo
                console.log(author)
                console.log("Trying to save and return")
                await author.save()
                return author
            } catch (err) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        myPlugin
    ]
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
