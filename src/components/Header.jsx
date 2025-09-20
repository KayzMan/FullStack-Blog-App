import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext'

import { ColorModeButton } from './ui/color-mode'

import { routesPaths } from '../constants/routesPaths'

import { User } from './User'

export function Header() {
  const [token, setToken] = useAuth()

  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <Flex
        alignItems={'center'}
        gap={'3'}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <nav>
          <User id={sub} />
        </nav>

        <ColorModeButton />

        <Button
          onClick={() => setToken(null)}
          size={'xs'}
          _hover={{ textDecor: 'underline' }}
          color={'white'}
          bg={'olive'}
        >
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <nav>
      <Flex
        alignItems={'center'}
        gap={'3'}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Link to={routesPaths.login}>
          <Button
            size={'xs'}
            _hover={{ textDecor: 'underline' }}
            color={'white'}
            bg={'olive'}
          >
            Log In
          </Button>
        </Link>

        <Link to={routesPaths.signup}>
          <Button
            size={'xs'}
            _hover={{ textDecor: 'underline' }}
            color={'white'}
            bg={'olive'}
          >
            Sign Up
          </Button>
        </Link>

        <ColorModeButton />
      </Flex>
    </nav>
  )
}
