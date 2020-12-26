const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
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
let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

const typeDefs = gql`
type Book {
    title: String!
    published: Int!
    author : String!
    id: ID!
    genres: [String]!
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
  }
`

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allAuthors: () => authors,
        allBooks: (root, args) => {
            let returnArray = books
            if (args.author) {
                returnArray = returnArray.filter(book => book.author === args.author)
            }
            if (args.genre) {

                return array = returnArray.filter(book => book.genres.includes(args.genre))
            }
            return returnArray
        }
    },
    Author: {
        bookCount: (root) => {
            return (
                books.filter(book => book.author === root.name).length
            )
        }

    },
    Mutation: {
        addBook: (root, args) => {

            console.log("Adding book", args)
            const book = { ...args, id: uuid() }
            books = books.concat(book)
            const author =authors.find(p => p.name ===args.author)
            console.log("Look me here")
            if(!author){
                console.log("No new author, will add")
                const newAuthor = {
                    name: args.author,
                    id: uuid()
                }
                console.log(newAuthor)
                console.log(authors)
                authors=authors.concat(newAuthor)
                console.log(authors)
            }
            return book
        },
        editAuthor: (root, args) => {
            const author = authors.find(p => p.name === args.name)
            if (!author) {
                return null
            }
            const updatedAuthor = { ...author, born: args.setBornTo }
            authors = authors.map(p => p.name === args.name ? updatedAuthor : p)
            return updatedAuthor
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
