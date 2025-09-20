import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'

import { routesPaths } from '../constants/routesPaths'
import { login } from '../api/users'
import { useAuth } from '../contexts/AuthContext'

import { toaster, Toaster } from '../components/ui/toaster'
import { BackButton } from '../components/BackButton'

export function Login() {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate()
  const [, setToken] = useAuth()

  const loginMutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (data) => {
      setToken(data.token)
      navigate(routesPaths.home)
    },
    onError: (error) => {
      console.error(error)
      console.error(error.message)
      console.error(error.cause)
      toaster.create({
        description: error.message,
        type: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate()
  }

  return (
    <Box p={'3'} maxW={'lg'} mx={'auto'}>
      <BackButton title={'Back'} destination={'/'} />
      {/* heading */}
      <Heading
        as={'h1'}
        textAlign={'center'}
        fontSize={'3xl'}
        fontWeight={'semibold'}
        my={'7'}
      >
        Login to your Account
      </Heading>

      {/* form */}
      <form onSubmit={handleSubmit}>
        <Stack gap={'4'}>
          {/* username */}
          <Field.Root
          //   invalid={errors.username}
          >
            <Input
              id='login-username'
              name='login-username'
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              //   {...register("username", { required: "Username is required" })}
            />
            {/* <Field.ErrorText>{errors.username && errors.username.message}</Field.ErrorText> */}
          </Field.Root>

          {/* password */}
          <Field.Root
          //   invalid={errors.password}
          >
            <Input
              id='login-password'
              name='login-password'
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              //   {...register("password", { required: "Password is required" })}
            />
            {/* <Field.ErrorText>{errors.password && errors.password.message}</Field.ErrorText> */}
          </Field.Root>

          {/* Submit Button */}
          <Button
            type='submit'
            loading={loginMutation.isPending}
            color={'white'}
            bg={'olive'}
            textTransform={'uppercase'}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </Stack>

        <Toaster />
      </form>

      {/* flex */}
      <Flex gap={2} mt={'5'}>
        <Text>Don&apos;t have an account?</Text>
        <Link to={routesPaths.signup}>
          <Text as={'span'} color={'blue.400'}>
            Sign Up
          </Text>
        </Link>
      </Flex>
    </Box>
  )
}
