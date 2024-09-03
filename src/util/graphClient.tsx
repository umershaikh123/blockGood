import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client"

export const graphClient = new ApolloClient({
  uri: "https://indexer.bigdevenergy.link/aeba037/v1/graphql",
  cache: new InMemoryCache(),
})
