import dotenv from 'dotenv'
dotenv.config()

import { initDatabase } from './src/db/init.js'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/event.js'
import { createUser } from './src/services/users.js'
import { createPost } from './src/services/posts.js'
import { trackEvent } from './src/services/events.js'

const oneHourSeconds = 60 * 60
const oneDayHours = 24
const oneDaySeconds = oneHourSeconds * oneDayHours
const oneDayMilliseconds = 1000 * oneDaySeconds
const thirtyDays_milliseconds = oneDayMilliseconds * 30

const simulationStart = Date.now() - thirtyDays_milliseconds
const simulationEnd = Date.now()

const simulatedUsers = 5
const simulatedPosts = 10
const simulatedViews = 10_000

async function simulateEvents() {
  const connection = await initDatabase()

  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulatedUsers)
      .fill(null)
      .map(
        async (_, u) =>
          await createUser({
            username: `user-${u}`,
            password: `password-${u}`,
          }),
      ),
  )
  console.log(`created ${createdUsers.length} users.`)

  await Post.deleteMany({})
  const createdPosts = await Promise.all(
    Array(simulatedPosts)
      .fill(null)
      .map(async (_, p) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * simulatedUsers)]

        return await createPost(randomUser._id, {
          title: `Test Post ${p}`,
          contents: `This is a test post ${p}`,
        })
      }),
  )
  console.log(`created ${createdPosts.length} posts.`)

  await Event.deleteMany({})
  const createdViews = await Promise.all(
    Array(simulatedViews)
      .fill(null)
      .map(async () => {
        const randomPost =
          createdPosts[Math.floor(Math.random() * simulatedPosts)]
        const sessionStart =
          simulationStart + Math.random() * (simulationEnd - simulationStart)

        // end after 0 to 5 minutes...
        const sessionEnd =
          sessionStart + 1000 * Math.floor(Math.random() * (60 * 5))

        // now we simulate the event collection
        // first by creating a startView event:
        const event = await trackEvent({
          postId: randomPost._id,
          action: 'startView',
          date: new Date(sessionStart),
        })

        // then we simulate an endView event, we use session ID returned from first event...
        await trackEvent({
          postId: randomPost._id,
          session: event.session,
          action: 'endView',
          date: new Date(sessionEnd),
        })
      }),
  )
  console.log(`successfully simulated ${createdViews.length} views.`)

  await connection.disconnect()
}

simulateEvents()
