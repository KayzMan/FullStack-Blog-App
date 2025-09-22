import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallBack'

import { Blog } from './Blog'

const queryClient = new QueryClient()

export function App({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <title>Full-Stack React Blog</title>
      <meta
        name='description'
        content='A blog full of articles about full-stack React development'
      />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Blog>{children}</Blog>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
