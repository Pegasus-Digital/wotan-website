import dotenv from 'dotenv'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'
import cookieParser from 'cookie-parser' // Import cookie-parser

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import express from 'express'
import payload from 'payload'
import isAuthenticated from './_middlewares/admin-auth'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cookieParser())

const start = async (): Promise<void> => {
  await payload.init({
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    secret: process.env.PAYLOAD_SECRET || '',
  })

  const router = express.Router()

  router.use(payload.authenticate)

  // router.get('/', (req, res, next) => {
  //   isAuthenticated(req).then((loggedIn) => {
  //     // console.log(req.path)
  //     if (!loggedIn && req.path !== '/login') {
  //       res.clearCookie('payload-token')

  //       const redirectUrl = `/dashboard/login?error=${encodeURIComponent(
  //         'Você deve estar logado para acessar o painel de Administrador',
  //       )}&redirect=${encodeURIComponent(req.originalUrl)}`
  //       res.redirect(redirectUrl)
  //     } else {
  //       next()
  //     }
  //   })
  // })

  const dashboardMiddleware = (req, res, next) => {
    // Check if the requested URL path starts with /dashboard
    // console.log(req.path)
    if (req.path !== '/login') {
      isAuthenticated(req).then((loggedIn) => {
        // console.log(req.path)
        if (!loggedIn) {
          res.clearCookie('payload-token')

          const redirectUrl = `/dashboard/login?error=${encodeURIComponent(
            'Você deve estar logado para acessar o painel de Administrador',
          )}&redirect=${encodeURIComponent(req.originalUrl)}`
          res.redirect(redirectUrl)
        } else {
          next()
        }
      })
    }
    // Move to the next middleware or route handler
    next()
  }

  app.use('/dashboard', dashboardMiddleware)

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  nextApp
    .prepare()
    .then(() => {
      payload.logger.info('Starting Next.js...')

      app.listen(PORT, async () => {
        payload.logger.info(
          `Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`,
        )
      })
    })
    .catch((err) => {
      payload.logger.error({ err }, 'Error starting Next.js')
    })
}

void start()
