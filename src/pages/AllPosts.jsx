import { Box, Heading, Link, Flex, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { useQuery as useGraphQLQuery } from '@apollo/client/react'
import { Link as RouterLink } from 'react-router-dom'

// components...
import { PostList } from '../components/PostList'
import { PostFilter } from '../components/PostFilter'
import { PostSorting } from '../components/PostSorting'
import { CustomAccordion } from '../components/CustomAccordion'
import { AllPostsSkeleton } from '../skeletons/AllPostsSkeleton'

import { routesPaths } from '../constants/routesPaths'

// api...
import {
  GET_POSTS,
  GET_POST_BY_AUTHOR,
  GET_POSTS_BY_TAG,
} from '../api/graphql/posts'

export function AllPosts() {
  const [filterMethod, setFilterMethod] = useState('author')
  const [author, setAuthor] = useState('')
  const [tag, setTag] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const { data } = useGraphQLQuery(
    author ? GET_POST_BY_AUTHOR : tag ? GET_POSTS_BY_TAG : GET_POSTS,
    {
      variables: { author, tag, options: { sortBy, sortOrder } },
    },
  )
  const posts = data?.postsByAuthor ?? data?.postsByTag ?? data?.posts ?? []

  return (
    <Box p={'8'} maxW={'5xl'} mx={'auto'}>
      {/* top bar */}
      <Flex justify={'space-between'}>
        {/* heading */}
        <Heading as={'h1'} textAlign={'center'} fontSize={'3xl'}>
          All Posts
        </Heading>

        {/* create new button */}
        <Link as={RouterLink} to={routesPaths.createPost}>
          <Button bg={'olive'}>Create New</Button>
        </Link>
      </Flex>

      <Box>
        {/* sorting */}
        <CustomAccordion
          the_key={'sorting'}
          title={'Sorting'}
          element={
            <PostSorting
              fields={['createdAt', 'updatedAt']}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              orderValue={sortOrder}
              onOrderChange={(orderValue) => setSortOrder(orderValue)}
            />
          }
        />

        {/* filtering */}
        <CustomAccordion
          the_key={'filtering'}
          title={'Filtering'}
          element={
            <PostFilter
              filterMethod={filterMethod}
              setFilterMethod={setFilterMethod}
              value={filterMethod == 'author' ? author : tag}
              onChange={(value) => {
                if (filterMethod == 'author') {
                  setAuthor(value)
                  setTag('')
                } else {
                  setTag(value)
                  setAuthor('')
                }
              }}
            />
          }
        />

        {/* all posts */}
        <Box mt={'8'}>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <>
              <Heading
                textAlign={'center'}
                mb={'10'}
                as={'h1'}
                fontSize={{ base: '2xl', md: '3xl' }}
              >
                No Posts Created Yet.
              </Heading>
              <AllPostsSkeleton />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
