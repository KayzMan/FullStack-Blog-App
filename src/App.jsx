import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ApolloProvider } from '@apollo/client/react/index.js'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client/core/index.js'

import { Blog } from './Blog'

const queryClient = new QueryClient()

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  cache: new InMemoryCache(),
})

export function App({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <title>Full-Stack React Blog</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development'
        />
        <Blog>{children}</Blog>
      </QueryClientProvider>
    </ApolloProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
