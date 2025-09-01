import {
  Box,
  Text,
  Card,
  Flex,
  Button,
  Image,
  Dialog,
  Portal,
  CloseButton,
  Separator,
  Stack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LuTrash2 } from 'react-icons/lu'
import { FiEdit } from 'react-icons/fi'
import { toaster, Toaster } from '../components/ui/toaster'

import { ViewPostSkeleton } from '../skeletons/ViewPostSkeleton'
import { BackButton } from '../components/BackButton'
import { TagsView } from '../components/TagsView'

// api...
import { getSinglePost, deletePost } from '../api/posts'

export function ViewPostPage() {
  const [post, setPost] = useState()
  const { postId } = useParams()
  const [showDelete, setShowDelete] = useState(false)
  const navigate = useNavigate()

  const fetchPostQuery = useQuery({
    queryKey: [`singlePost:${postId}`],
    queryFn: () => getSinglePost(postId),
  })

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toaster.create({
        title: 'Post deleted successfully!',
        type: 'success',
        duration: 5000,
      })

      setShowDelete(false)

      navigate('/')
    },
    onError: () => {
      toaster.create({
        title: 'Failed to delete post!',
        type: 'error',
        duration: 5000,
      })
    },
  })

  useEffect(() => {
    const data = fetchPostQuery.data
    setPost(data)
  }, [fetchPostQuery])

  if (!post) {
    return <ViewPostSkeleton />
  }

  return (
    <Box maxW={'xl'} mx={'auto'}>
      <Box mb={'6'}>
        <BackButton title='All Posts' destination={'/'} />
      </Box>

      <Card.Root
        flex={'1'}
        variant={'elevated'}
        overflow={'hidden'}
        mx={'auto'}
      >
        <Image
          alt='blog image'
          src='https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D'
          objectFit={'cover'}
        />
        <Box>
          <Card.Body gap={'2'}>
            <Card.Title mt={'2'}>{post.title}</Card.Title>
            <Card.Description>
              <Stack>
                {post.author && (
                  <Text>
                    Written by{' '}
                    <Text as={'span'} fontWeight={'semibold'}>
                      {post.author}
                    </Text>
                  </Text>
                )}

                <TagsView tags={post.tags} />
              </Stack>
            </Card.Description>
            <Separator />
            <Card.Description>{post.contents}</Card.Description>
          </Card.Body>
          <Card.Footer justifyContent={'flex-end'}>
            {/* view post icon button */}
            <Button
              variant={'outline'}
              size={'xs'}
              _hover={{ color: 'white', bg: 'black' }}
              onClick={() => {
                navigate(`/update/${postId}`)
              }}
            >
              <FiEdit /> Update Post
            </Button>

            {/* delete confirmation */}
            <Dialog.Root
              lazyMount
              open={showDelete}
              onOpenChange={(e) => setShowDelete(e.open)}
            >
              <Dialog.Trigger asChild>
                <Button
                  // onClick={setShowDelete}
                  variant={'subtle'}
                  colorPalette={'red'}
                  size={'xs'}
                  _hover={{ color: 'white', bg: 'red.400' }}
                >
                  <LuTrash2 /> Delete Post
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>
                        <Flex alignItems={'center'} gap={'2'}>
                          <LuTrash2 />{' '}
                          <Text as={'span'}> Delete Confirmation </Text>
                        </Flex>
                      </Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Text>Are you sure you want to delete this post?</Text>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant='outline'>Cancel</Button>
                      </Dialog.ActionTrigger>

                      <Button
                        colorPalette={'red'}
                        onClick={() => deletePostMutation.mutate()}
                      >
                        Delete
                      </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size='sm' />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Card.Footer>
        </Box>
      </Card.Root>

      <Toaster />
    </Box>
  )
}
