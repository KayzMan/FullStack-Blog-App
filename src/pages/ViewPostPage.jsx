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
  Center,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useQuery as useGraphQLQuery,
  useMutation as useGraphQLMutation,
} from '@apollo/client/react'
import { useMutation } from '@tanstack/react-query'
import { LuTrash2 } from 'react-icons/lu'
import { FiEdit } from 'react-icons/fi'
import { toaster, Toaster } from '../components/ui/toaster'
import slug from 'slug'

import { PostStats } from '../components/PostStats'

import { ViewPostSkeleton } from '../skeletons/ViewPostSkeleton'
import { BackButton } from '../components/BackButton'
import { TagsView } from '../components/TagsView'
import { User } from '../components/User'

import { useAuth } from '../contexts/AuthContext'

// api...
import {
  DELETE_POST,
  GET_POST_BY_ID,
  GET_POST_BY_AUTHOR,
  GET_POSTS,
  GET_POSTS_BY_TAG,
} from '../api/graphql/posts'
import { postTrackEvent } from '../api/events'

export function ViewPostPage() {
  const { postId } = useParams()
  const [showDelete, setShowDelete] = useState(false)
  const [session, setSession] = useState()

  const navigate = useNavigate()
  const [token] = useAuth()

  const fetchPostQuery = useGraphQLQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  })

  // the post...
  const post = fetchPostQuery.data?.postById

  const [deletePost] = useGraphQLMutation(DELETE_POST, {
    variables: { postId },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [
      {
        query: GET_POSTS,
        variables: {
          options: { sortBy: 'createdAt', sortOrder: 'descending' },
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      console.log('data;;;;', data)
      if (data?.deletePost) {
        if (data?.deletePost?.deletedCount == 1) {
          toaster.create({
            title: 'Post deleted successfully!',
            type: 'success',
            duration: 5000,
          })

          setShowDelete(false)
          navigate('/')
        } else {
          toaster.create({
            title: 'Failed to delete post!!',
            type: 'error',
            duration: 5000,
          })
        }

        setShowDelete(false)
      } else {
        toaster.create({
          title: 'Failed to delete post!!!',
          type: 'error',
          duration: 5000,
        })
      }
    },
    onError: (error) => {
      console.error(error)

      if (error.message.includes('Received status code 401') || !token) {
        toaster.create({
          title: 'Failed to delete post! You must be logged in.',
          type: 'error',
          duration: 5000,
        })
      } else {
        toaster.create({
          title: 'Failed to delete post!',
          type: 'error',
          duration: 5000,
        })
      }

      setShowDelete(false)
    },
  })

  /*
  *****
   TODO: vEry important!
  ****
  */
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data.session),
  })

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)

    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

  function truncate(str, max = 160) {
    if (!str) return str
    if (str.length > max) {
      return str.slice(0, max - 3) + '...'
    } else {
      return str
    }
  }

  if (!post) {
    return <ViewPostSkeleton />
  }

  return (
    <Center>
      <Box m={'10'} mb={'10'} maxW={'fit-content'}>
        <title>{`${post.title} | Full-Stack React Blog`}</title>
        <meta name='description' content={truncate(post.contents)} />

        {/* Open Graph (og) meta tags... */}
        <meta property='og:type' content='article' />
        <meta property='og:title' content={post.title} />
        <meta property='og:article:published_time' content={post.createdAt} />
        <meta property='og:article:modified_time' content={post.updatedAt} />
        <meta property='og:article:author' content={post?.author?.username} />
        {(post.tags ?? []).map((tag) => (
          <meta key={tag} property='og:article:tag' content={tag} />
        ))}

        <Box mb={'6'}>
          <BackButton title='All Posts' destination={'/'} />
        </Box>

        <Center>
          <Flex flexDirection={{ base: 'column', xl: 'row' }} gap={'8'}>
            <Card.Root
              flex={'1'}
              variant={'elevated'}
              overflow={'hidden'}
              mx={'auto'}
              maxW={'xl'}
              maxH={'fit-content'}
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
                    Written by {''}
                    {post.author?.username && <User {...post.author} />}
                  </Card.Description>
                  <TagsView tags={post.tags} />
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
                      navigate(`/posts/update/${postId}/${slug(post.title)}`)
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
                            <Text>
                              Are you sure you want to delete this post?
                            </Text>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant='outline'>Cancel</Button>
                            </Dialog.ActionTrigger>

                            <Button
                              colorPalette={'red'}
                              onClick={() => deletePost()}
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

            <Separator
              orientation={{ base: 'horizontal', lg: 'vertical' }}
              color={'olive'}
            />

            <PostStats postId={postId} />
          </Flex>
        </Center>

        <Toaster />
      </Box>
    </Center>
  )
}
