import { gql } from '@apollo/client'

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    author {
      username
    }
    id
    title
    contents
    tags
    updatedAt
    createdAt
  }
`

export const GET_POSTS = gql`
  ${POST_FIELDS}
  query getPosts($options: PostsOptions) {
    posts(options: $options) {
      ...PostFields
    }
  }
`

export const GET_POST_BY_ID = gql`
  ${POST_FIELDS}
  query getPostById($id: ID!) {
    postById(id: $id) {
      ...PostFields
    }
  }
`

export const GET_POST_BY_AUTHOR = gql`
  ${POST_FIELDS}
  query getPostsByAuthor($author: String!, $options: PostsOptions) {
    postsByAuthor(username: $author, options: $options) {
      ...PostFields
    }
  }
`

export const GET_POSTS_BY_TAG = gql`
  ${POST_FIELDS}
  query getPostsByTag($tag: String!, $options: PostsOptions) {
    postsByTag(tag: $tag, options: $options) {
      ...PostFields
    }
  }
`

export const CREATE_POST = gql`
  mutation createPost($title: String!, $contents: String, $tags: [String!]) {
    createPost(title: $title, contents: $contents, tags: $tags) {
      id
      title
    }
  }
`

export const UPDATE_POST = gql`
  mutation updatePost(
    $postId: ID!
    $title: String!
    $contents: String
    $tags: [String!]
  ) {
    updatePost(
      postId: $postId
      title: $title
      contents: $contents
      tags: $tags
    ) {
      id
      title
    }
  }
`

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      acknowledged
      deletedCount
    }
  }
`
