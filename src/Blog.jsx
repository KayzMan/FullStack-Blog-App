import PropTypes from 'prop-types'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import { AuthContextProvider } from './contexts/AuthContext'

// components...
import { ColorModeProvider } from './components/ui/color-mode'

export function Blog({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

Blog.propTypes = {
  children: PropTypes.element.isRequired,
}
