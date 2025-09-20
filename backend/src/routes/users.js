import { createUser, loginUser, getUserInfoById } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username) {
        return res.status(400).send({
          error: 'signup failed, did you provide your username?',
        })
      }

      if (!password) {
        return res.status(400).send({
          error: 'signup failed, did you provide your password?',
        })
      }

      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (error) {
      console.error(error)

      if (error.message?.includes('`username` is required')) {
        return res.status(400).json({
          error: 'failed to create the user, did you provide your username?',
        })
      }

      if (error.message?.includes('data and salt arguments required')) {
        return res.status(400).json({
          error: 'failed to create the user, did you provide your password?',
        })
      }

      if (
        error.code == '11000' &&
        error?.errorResponse?.errmsg?.includes('duplicate')
      ) {
        return res.status(400).json({
          error: 'failed to create the user, does the username already exist?',
        })
      }

      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const { username, password } = req.body
      if (!username) {
        return res.status(400).send({
          error: 'login failed, did you provide your username?',
        })
      }

      if (!password) {
        return res.status(400).send({
          error: 'login failed, did you provide your password?',
        })
      }

      const token = await loginUser(req.body)
      return res.status(200).send({ token })
    } catch (error) {
      console.error(error)

      if (error?.message?.includes('invalid username!')) {
        return res.status(400).send({
          error: 'login failed, invalid username!',
        })
      }

      if (error?.message?.includes('data and hash arguments required')) {
        return res.status(400).send({
          error: 'login failed, did you provide your password?',
        })
      }

      if (error?.message?.includes('invalid password!')) {
        return res.status(400).send({
          error: 'login failed, invalid password!',
        })
      }

      return res.status(400).send({
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })

  app.get('/api/v1/users/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).send(userInfo)
  })
}
