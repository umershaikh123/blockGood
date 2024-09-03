import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client"

export const graphClient = new ApolloClient({
  uri: "https://indexer.bigdevenergy.link/9c92bac/v1/graphql",
  cache: new InMemoryCache(),
})
