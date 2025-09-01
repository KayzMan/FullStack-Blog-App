import { SimpleGrid } from '@chakra-ui/react'
import PropTypes from 'prop-types'

import { Post } from './Post'

export function PostList({ posts = [] }) {
  return (
    <SimpleGrid columns={[1, 1, 2, 3]} gap={'4'}>
      {posts.map((post) => (
        <Post {...post} key={post._id} />
      ))}
    </SimpleGrid>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
