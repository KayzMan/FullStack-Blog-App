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
import { useMutation as useGraphQLMutation } from '@apollo/client/react'
import { useNavigate, Link } from 'react-router-dom'

import { routesPaths } from '../constants/routesPaths'
import { SIGNUP_USER } from '../api/graphql/users'

import { toaster, Toaster } from '../components/ui/toaster'
import { BackButton } from '../components/BackButton'

export function Signup() {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate()

  const [signupUser, { loading }] = useGraphQLMutation(SIGNUP_USER, {
    variables: { username, password },
    onCompleted: () => navigate(routesPaths.login),
    onError: (error) => {
      toaster.create({
        description: error.message,
        type: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    signupUser()
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
        Create an Account
      </Heading>

      {/* form */}
      <form onSubmit={handleSubmit}>
        <Stack gap={'4'}>
          {/* username */}
          <Field.Root
          //   invalid={errors.username}
          >
            <Input
              id='create-username'
              name='create-username'
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
              id='create-password'
              name='create-password'
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
            loading={loading}
            disabled={!username || !password || loading}
            color={'white'}
            bg={'olive'}
            textTransform={'uppercase'}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Stack>

        <Toaster />
      </form>

      {/* flex */}
      <Flex gap={2} mt={'5'}>
        <Text>Have an account?</Text>
        <Link to={'/signin'}>
          <Text as={'span'} color={'blue.400'}>
            Sign in
          </Text>
        </Link>
      </Flex>
    </Box>
  )
}
