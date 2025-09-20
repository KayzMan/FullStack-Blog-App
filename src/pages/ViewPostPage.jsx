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
} from '@chakra-ui/react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LuTrash2 } from 'react-icons/lu'
import { FiEdit } from 'react-icons/fi'
import { toaster, Toaster } from '../components/ui/toaster'
import slug from 'slug'

import { ViewPostSkeleton } from '../skeletons/ViewPostSkeleton'
import { BackButton } from '../components/BackButton'
import { TagsView } from '../components/TagsView'
import { User } from '../components/User'

import { useAuth } from '../contexts/AuthContext'

// api...
import { getSinglePost, deletePost } from '../api/posts'
import { getUserInfo } from '../api/users'

export function ViewPostPage() {
  const { postId } = useParams()
  const [showDelete, setShowDelete] = useState(false)

  const navigate = useNavigate()
  const [token] = useAuth()

  const fetchPostQuery = useQuery({
    queryKey: ['singlePost'],
    queryFn: () => getSinglePost(postId),
  })

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInfoQuery.data ?? {}

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(token, postId),
    onSuccess: (status) => {
      if (status === 204) {
        toaster.create({
          title: 'Post deleted successfully!',
          type: 'success',
          duration: 5000,
        })

        setShowDelete(false)
        navigate('/')
      } else {
        toaster.create({
          title: 'Failed to delete post!',
          type: 'error',
          duration: 5000,
        })
      }

      setShowDelete(false)
    },
    onError: () => {
      toaster.create({
        title: 'Failed to delete post!',
        type: 'error',
        duration: 5000,
      })
    },
  })

  const post = fetchPostQuery.data

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
    <Box maxW={'xl'} mx={'auto'} mb={'10'}>
      <title>{`${post.title} | Full-Stack React Blog`}</title>
      <meta name='description' content={truncate(post.contents)} />

      {/* Open Graph (og) meta tags... */}
      <meta property='og:type' content='article' />
      <meta property='og:title' content={post.title} />
      <meta property='og:article:published_time' content={post.createdAt} />
      <meta property='og:article:modified_time' content={post.updatedAt} />
      <meta property='og:article:author' content={userInfo.username} />
      {(post.tags ?? []).map((tag) => (
        <meta key={tag} property='og:article:tag' content={tag} />
      ))}

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
              Written by {''}
              {post.author && <User id={post.author} />}
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
