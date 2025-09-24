import PropTypes from 'prop-types'
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
import {
  useQuery as useGraphQLQuery,
  useMutation as useGraphQLMutation,
} from '@apollo/client/react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu'

import { TagsView } from './TagsView'

import {
  GET_POST_BY_ID,
  UPDATE_POST,
  GET_POSTS,
  GET_POSTS_BY_TAG,
  GET_POST_BY_AUTHOR,
} from '../api/graphql/posts'
import { useAuth } from '../contexts/AuthContext'

export function UpdatePost() {
  const { postId } = useParams()
  const [title, setTitle] = useState()
  const [contents, setContents] = useState()
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')

  const navigate = useNavigate()
  const [token] = useAuth()

  const { data } = useGraphQLQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  })

  useEffect(() => {
    setTitle(data?.postById?.title)
    setContents(data?.postById?.contents)
    setTags(data?.postById?.tags)
  }, [data])

  const [updatePost, { updateLoading }] = useGraphQLMutation(UPDATE_POST, {
    variables: { postId, title, contents, tags },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [{ query: GET_POSTS }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.updatePost) {
        toaster.create({
          title: 'Post updated successfully!',
          type: 'success',
          duration: 5000,
        })

        setTimeout(() => {
          navigate(`/posts/${postId}`)
        }, 1000)
      } else {
        toaster.create({
          title: `Failed to Update Post!`,
          type: 'error',
          duration: 5000,
        })
      }
    },
    onError: (error) => {
      console.error(error)
      toaster.create({
        title: `Failed to Update Post: ${error.message}`,
        type: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePost()
  }

  return (
    <Box>
      <title>{`${title} | Full-Stack React Blog`}</title>
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
                <IconButton variant='outline' size='xs'>
                  <LuX />
                </IconButton>
              </Editable.CancelTrigger>
              <Editable.SubmitTrigger asChild>
                <IconButton
                  variant='outline'
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
            value={updateLoading ? 'Updating...' : 'Update'}
            disabled={!title || updateLoading}
            bg={'olive'}
          >
            {updateLoading ? 'Updating...' : 'Update'}
          </Button>

          <Toaster />
        </Stack>
      </form>
    </Box>
  )
}

UpdatePost.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
}
