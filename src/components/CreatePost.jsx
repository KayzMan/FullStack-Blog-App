import {
  Field,
  Input,
  Stack,
  Textarea,
  Box,
  Button,
  Editable,
  IconButton,
} from '@chakra-ui/react'
import { Toaster, toaster } from './ui/toaster'
import { useMutation as useGraphQLMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu'

import { TagsView } from './TagsView'

import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_TAG,
  GET_POST_BY_AUTHOR,
} from '../api/graphql/posts'
import { useAuth } from '../contexts/AuthContext'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState([])

  const navigate = useNavigate()
  const [token] = useAuth()

  const [createPost, { loading }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents, tags },
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
      console.log(data)
      if (data?.createPost) {
        toaster.create({
          title: 'Post created successfully!',
          type: 'success',
          duration: 5000,
        })

        setTitle('')
        setContents('')

        setTimeout(() => {
          navigate('/')
        }, 800)
      } else {
        toaster.create({
          title: `Something went wrong!!`,
          type: 'error',
          duration: 5000,
        })
      }
    },
    onError: (error) => {
      console.error(error)
      toaster.create({
        title: `Something went wrong: ${error.message}`,
        type: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }

  if (!token) {
    return <Box>Please log in to create new posts.</Box>
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Stack gap={'4'}>
          {/* title */}
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              type='text'
              name='create-title'
              id="'create-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field.Root>

          {/* contents */}
          <Field.Root>
            <Textarea
              placeholder='contents'
              autoresize
              size={'xl'}
              value={contents}
              onChange={(e) => setContents(e.target.value)}
            />
          </Field.Root>

          {/* tags */}
          <Editable.Root
            defaultValue='Add tag'
            value={newTag}
            placeholder={'Add tag'}
            onValueChange={(e) => setNewTag(e.value)}
          >
            <Editable.Preview />
            <Editable.Input />
            <Editable.Control>
              <Editable.EditTrigger asChild>
                <IconButton variant='ghost' size='xs'>
                  <LuPencilLine />
                </IconButton>
              </Editable.EditTrigger>
              <Editable.CancelTrigger asChild>
                <IconButton variant='subtle' color={'red'} size='xs'>
                  <LuX />
                </IconButton>
              </Editable.CancelTrigger>
              <Editable.SubmitTrigger asChild>
                <IconButton
                  variant='solid'
                  color={'white'}
                  bg={'green'}
                  size='xs'
                  onClick={() => {
                    if (newTag) {
                      setTags((tags) => [newTag, ...tags])
                      setNewTag('')
                    }
                  }}
                >
                  <LuCheck />
                </IconButton>
              </Editable.SubmitTrigger>
            </Editable.Control>
          </Editable.Root>

          <TagsView tags={tags} />

          {/* submit button */}
          <Button
            type='submit'
            value={loading ? 'Creating...' : 'Create'}
            disabled={!title || loading}
            bg={'olive'}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <Toaster />
        </Stack>
      </form>
    </Box>
  )
}
