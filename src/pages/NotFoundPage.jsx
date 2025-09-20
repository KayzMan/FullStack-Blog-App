// pages/NotFoundPage.jsx
import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box textAlign='center' mt='20'>
      <Heading size='3xl' mb='4'>
        404
      </Heading>
      <Text fontSize='xl' mb='6'>
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </Text>
      <Button as={Link} to='/' colorScheme='teal'>
        Go Back Home
      </Button>
    </Box>
  )
}
