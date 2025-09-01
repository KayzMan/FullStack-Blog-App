import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

import { UpdatePost } from '../components/UpdatePost'
import { BackButton } from '../components/BackButton'

export function UpdatePostPage() {
  const { postId } = useParams()

  return (
    <Box p={'8'} maxW={'2xl'} mx={'auto'}>
      <Flex my={'4'}>
        <BackButton title={'Back'} destination={`/${postId}`} />

        <Spacer />

        <Heading as={'h1'} textAlign={'center'} my={'4'}>
          Update Post
        </Heading>

        <Spacer />
      </Flex>

      <UpdatePost />
    </Box>
  )
}
