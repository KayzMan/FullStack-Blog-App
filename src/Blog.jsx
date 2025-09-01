import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  ChakraProvider,
  defaultSystem,
  Heading,
  Highlight,
} from '@chakra-ui/react'

import { AllPosts } from './pages/AllPosts'
import { CreatePostPage } from './pages/CreatePostPage'
import { UpdatePostPage } from './pages/UpdatePostPage'
import { ViewPostPage } from './pages/ViewPostPage'

export function Blog() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Heading size='5xl' letterSpacing='tight' textAlign={'center'} my={'10'}>
        <Highlight query='Blog' styles={{ color: 'olive' }}>
          Blog App ✍️
        </Highlight>
      </Heading>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AllPosts />} />
          <Route path='/:postId' element={<ViewPostPage />} />
          <Route path='/create' element={<CreatePostPage />} />
          <Route path='/update/:postId' element={<UpdatePostPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}
