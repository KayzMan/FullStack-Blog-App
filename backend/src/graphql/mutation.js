import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost, deletePost, updatePost } from '../services/posts.js'

export const mutationSchema = `#graphql
    type Mutation {
        signupUser(username: String!, password: String!): User
        loginUser(username: String!, password: String!): String
        createPost(title: String!, contents: String, tags: [String]): Post
        updatePost(postId: ID!, title: String, contents: String, tags: [String!]): Post
        deletePost(postId: ID!): DeleteAcknowledgement
        
    }
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
    createPost: async (parent, { title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }

      return await createPost(auth.sub, { title, contents, tags })
    },
    updatePost: async (parent, { postId, title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }

      return await updatePost(auth.sub, postId, { title, contents, tags })
    },
    deletePost: async (parent, { postId }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }

      return await deletePost(auth.sub, postId)
    },
  },
}
