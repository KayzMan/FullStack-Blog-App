import { querySchema, queryResolver } from './query.js'
import { postSchema, postResolver } from './post.js'
import { userSchema, userResolver } from './user.js'
import { mutationResolver, mutationSchema } from './mutation.js'
import { deleteAcknowledgementSchema } from './delete_acknowledgement.js'

export const typeDefs = [
  querySchema,
  postSchema,
  userSchema,
  mutationSchema,
  deleteAcknowledgementSchema,
]
export const resolvers = [
  queryResolver,
  postResolver,
  userResolver,
  mutationResolver,
]
