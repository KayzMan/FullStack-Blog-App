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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu'

import { TagsView } from './TagsView'

import { createPost } from '../api/posts'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState([])

  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author, contents, tags }),
    onSuccess: () => {
      toaster.create({
        title: 'Post created successfully!',
        type: 'success',
        duration: 5000,
      })
      queryClient.invalidateQueries(['posts'])

      setTitle('')
      setAuthor('')
      setContents('')

      setTimeout(() => {
        navigate('/')
      }, 800)
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
    createPostMutation.mutate()
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

          {/* author */}
          <Field.Root>
            <Field.Label>Author</Field.Label>
            <Input
              type='text'
              name='create-author'
              id='create-author'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
            value={createPostMutation.isPending ? 'Creating...' : 'Create'}
            disabled={!title || createPostMutation.isPending}
            bg={'olive'}
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create'}
          </Button>

          <Toaster />
        </Stack>
      </form>
    </Box>
  )
}
