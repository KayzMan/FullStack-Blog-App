import PropTypes from 'prop-types'
import {
  Card,
  Text,
  IconButton,
  Image,
  Dialog,
  Portal,
  Flex,
  Button,
  CloseButton,
} from '@chakra-ui/react'
import { LuEye, LuTrash2 } from 'react-icons/lu'
import { useState, Fragment } from 'react'
import { toaster, Toaster } from '../components/ui/toaster'
import { useMutation as useGraphQLMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import slug from 'slug'

import { TagsView } from './TagsView'
import { User } from './User'

import {
  DELETE_POST,
  GET_POST_BY_AUTHOR,
  GET_POSTS,
  GET_POSTS_BY_TAG,
} from '../api/graphql/posts'
import { useAuth } from '../contexts/AuthContext'

export function Post({ title, author, id: postId, tags }) {
  const [showDelete, setShowDelete] = useState(false)
  const navigate = useNavigate()
  const [token] = useAuth()

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

  return (
    <Fragment>
      <Card.Root flex={'1'} variant={'elevated'} overflow={'hidden'}>
        <Image
          alt='blog image'
          src='https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D'
          objectFit={'cover'}
        />
        <Card.Body gap={'2'}>
          <Card.Title mt={'2'}>{title}</Card.Title>
          <Card.Description>
            Written by {''}
            {author && <User {...author} />}
          </Card.Description>
        </Card.Body>
        <Card.Footer justifyContent={'flex-end'}>
          <TagsView tags={tags} />
          {/* view post icon button */}
          <IconButton
            variant={'outline'}
            size={'xs'}
            _hover={{ color: 'white', bg: 'black' }}
            onClick={() => {
              navigate(`/posts/${postId}/${slug(title)}`)
            }}
          >
            <LuEye />
          </IconButton>

          {/* delete confirmation */}
          <Dialog.Root
            lazyMount
            open={showDelete}
            onOpenChange={(e) => setShowDelete(e.open)}
          >
            <Dialog.Trigger asChild>
              <IconButton
                onClick={setShowDelete}
                variant={'subtle'}
                colorPalette={'red'}
                size={'xs'}
                _hover={{ color: 'white', bg: 'red.400' }}
              >
                <LuTrash2 />
              </IconButton>
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

                    <Button colorPalette={'red'} onClick={() => deletePost()}>
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
      </Card.Root>

      <Toaster />
    </Fragment>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
}
