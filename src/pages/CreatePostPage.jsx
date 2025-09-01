import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'

import { CreatePost } from '../components/CreatePost'
import { BackButton } from '../components/BackButton'

export function CreatePostPage() {
  return (
    <Box p={'8'} maxW={'2xl'} mx={'auto'}>
      <Flex my={'4'}>
        <BackButton title={'All Posts'} destination={'/'} />

        <Spacer />

        <Heading as={'h1'} textAlign={'center'} my={'4'}>
          Create New Post
        </Heading>

        <Spacer />
      </Flex>

      <CreatePost />
    </Box>
  )
}
