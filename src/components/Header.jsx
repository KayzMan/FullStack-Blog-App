import { Button, Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../contexts/AuthContext'

import { ColorModeButton } from './ui/color-mode'

import { routesPaths } from '../constants/routesPaths'
import { getUserInfo } from '../api/users'

import { User } from './User'

export function Header() {
  const [token, setToken] = useAuth()
  const { sub } = token ? jwtDecode(token) : {}
  const userInfoQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })

  const userInfo = userInfoQuery.data

  if (token && userInfo) {
    return (
      <Flex
        alignItems={'center'}
        gap={'3'}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <nav>
          <User {...userInfo} />
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
