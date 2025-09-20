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
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LuPencilLine, LuX, LuCheck } from 'react-icons/lu'

import { TagsView } from './TagsView'

import { updatePost, getSinglePost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'

export function UpdatePost() {
  const { postId } = useParams()
  const [title, setTitle] = useState()
  const [contents, setContents] = useState()
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')

  const navigate = useNavigate()
  const [token] = useAuth()

  const fetchPostQuery = useQuery({
    queryKey: ['singlePost'],
    queryFn: () => getSinglePost(postId),
  })

  const updatePostMutation = useMutation({
    mutationFn: () => updatePost(token, postId, { title, contents, tags }),
    onSuccess: () => {
      toaster.create({
        title: 'Post updated successfully!',
        type: 'success',
        duration: 5000,
      })

      setTimeout(() => {
        navigate(`/posts/${postId}`)
      }, 1000)
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

  useEffect(() => {
    const post = fetchPostQuery.data
    setTitle(post?.title)
    setContents(post?.contents)
    setTags(post?.tags)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePostMutation.mutate()
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
            value={updatePostMutation.isPending ? 'Updating...' : 'Update'}
            disabled={!title || updatePostMutation.isPending}
            bg={'olive'}
          >
            {updatePostMutation.isPending ? 'Updating...' : 'Update'}
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
