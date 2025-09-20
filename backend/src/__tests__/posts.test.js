import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'

import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

// describes a group of tests...
// creating posts - test suite...
describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'hello, Mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost('000000000000000000000000', post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    expect(createdPost.author).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      contents: 'Post with no title',
      tags: ['empty'],
    }

    try {
      await createPost('000000000000000000000000', post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('without userId should fail', async () => {
    const post = {
      title: 'without author',
      contents: 'Post with no title',
      tags: ['empty'],
    }

    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
      expect(error.message).toContain(
        "Cannot destructure property 'title' of 'undefined'",
      )
    }
  })

  test('without title and author should fail', async () => {
    const post = {
      contents: 'Post with no title and author',
      tags: ['empty'],
    }

    try {
      await createPost('000000000000000000000000', post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }

    const createdPost = await createPost('000000000000000000000000', post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  {
    title: 'Learning Redux',
    author: new mongoose.Types.ObjectId('000000000000000000000000'),
    tags: ['redux'],
  },
  {
    title: 'Learn React Hooks',
    author: new mongoose.Types.ObjectId('000000000000000000000001'),
    tags: ['react'],
  },
  {
    title: 'Full-Stack React Projects',
    author: new mongoose.Types.ObjectId('000000000000000000000002'),
    tags: ['react', 'nodejs'],
  },
  {
    title: 'Guide to TypeScript',
    author: new mongoose.Types.ObjectId('000000000000000000000003'),
  },
]

let createdSamplePosts = []
let testUser = null

beforeAll(async () => {
  await User.deleteMany({})

  // create single user for tests
  const newUser = new User({ username: 'TestUser', password: '123' })
  testUser = await newUser.save()
})

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []

  // Update the first sample post to have TestUser as author
  const updatedSamplePosts = samplePosts.map((post, index) => {
    if (index === 0) {
      return { ...post, author: testUser._id }
    }
    return post
  })

  for (const post of updatedSamplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

// listing posts - test suite...
describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )

    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })

    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )

    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('TestUser')
    expect(posts.length).toBe(1)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

// getting a post - test suite...
describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

// updating posts - test suite...
describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some contents',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.contents).toEqual('some contents')
  })

  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some contents',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updateAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      contents: 'some contents',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost(
      '000000000000000000000000',
      '000000000000000000000002',
      {
        contents: 'some contents',
      },
    )
    expect(post).toEqual(null)
  })
})

// delete posts - test suite
describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(
      testUser._id,
      createdSamplePosts[0]._id,
    )
    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost(
      '000000000000000000000001',
      '000000000000000000000000',
    )
    expect(result.deletedCount).toEqual(0)
  })
})
