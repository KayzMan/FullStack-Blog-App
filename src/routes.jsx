import { useLoaderData, Outlet } from 'react-router-dom'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { Flex, Heading, Highlight } from '@chakra-ui/react'

//pages...
import { AllPosts } from './pages/AllPosts'
import { CreatePostPage } from './pages/CreatePostPage'
import { UpdatePostPage } from './pages/UpdatePostPage'
import { ViewPostPage } from './pages/ViewPostPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'

import { Header } from './components/Header'

import { routesPaths } from './constants/routesPaths'
import { getPosts, getSinglePost } from './api/posts'
import { getUserInfo } from './api/users'

export const routes = [
  {
    element: (
      <>
        <Flex
          p='8'
          maxW='5xl'
          mx='auto'
          alignItems='center'
          justifyContent='space-between'
        >
          <Heading size='5xl' letterSpacing='tight' textAlign='center' my='10'>
            <Highlight query='Blog' styles={{ color: 'olive' }}>
              Blog App ✍️
            </Highlight>
          </Heading>

          <Header />
        </Flex>

        {/* 👇 This tells React Router where to render the active child route */}
        <Outlet />
      </>
    ),
    children: [
      {
        path: routesPaths.home,
        loader: async () => {
          const queryClient = new QueryClient()
          const author = ''
          const tag = ''
          const sortBy = 'createdAt'
          const sortOrder = 'descending'
          const posts = await getPosts({ author, tag, sortBy, sortOrder })

          await queryClient.prefetchQuery({
            queryKey: ['posts', { author, tag, sortBy, sortOrder }],
            queryFn: () => posts,
          })

          const uniqueAuthors = posts
            .map((post) => post.author)
            .filter((value, index, array) => array.indexOf(value) === index)

          for (const userId of uniqueAuthors) {
            await queryClient.prefetchQuery({
              queryKey: ['users', userId],
              queryFn: () => getUserInfo(userId),
            })
          }

          return dehydrate(queryClient)
        },
        Component() {
          const dehydratedState = useLoaderData()
          return (
            <HydrationBoundary state={dehydratedState}>
              <AllPosts />
            </HydrationBoundary>
          )
        },
      },
      {
        path: routesPaths.viewSinglePost,
        loader: async ({ params }) => {
          const postId = params.postId
          const queryClient = new QueryClient()
          const post = await getSinglePost(postId)

          await queryClient.prefetchQuery({
            queryKey: ['singlePost', postId],
            queryFn: () => post,
          })

          if (post?.author) {
            await queryClient.prefetchQuery({
              queryKey: ['users', post.author],
              queryFn: () => getUserInfo(post.author),
            })
          }

          console.log('post:-->', post)

          return dehydrate(queryClient)
        },
        Component() {
          const dehydratedState = useLoaderData()
          return (
            <HydrationBoundary state={dehydratedState}>
              <ViewPostPage />
            </HydrationBoundary>
          )
        },
      },
      {
        path: routesPaths.createPost,
        element: <CreatePostPage />,
      },
      {
        path: routesPaths.updatePost,
        element: <UpdatePostPage />,
      },
      {
        path: routesPaths.signup,
        element: <Signup />,
      },
      {
        path: routesPaths.login,
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
