import dotenv from 'dotenv'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import express from 'express'

// import payload from 'payload'
// import { seed } from './payload/seed'
// const app = express()
// const PORT = process.env.PORT || 3000
// const start = async (): Promise<void> => {
//   await payload.init({
//     secret: process.env.PAYLOAD_SECRET || '',
//     express: app,
//     onInit: () => {
//       payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
//     },
//   })
//   if (process.env.PAYLOAD_SEED === 'true') {
//     await seed(payload)
//     process.exit()
//   }
//   if (process.env.NEXT_BUILD) {
//     app.listen(PORT, async () => {
//       payload.logger.info(`Next.js is now building...`)
//       // @ts-expect-error
//       await nextBuild(path.join(__dirname, '../'))
//       process.exit()
//     })
//     return
//   }
//   const nextApp = next({
//     dev: process.env.NODE_ENV !== 'production',
//   })
//   const nextHandler = nextApp.getRequestHandler()
//   app.use((req, res) => nextHandler(req, res))
//   nextApp.prepare().then(() => {
//     payload.logger.info('Starting Next.js...')
//     app.listen(PORT, async () => {
//       payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
//     })
//   })
// }
// start()
import { getPayloadClient } from './getPayload'

const app = express()
const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  const payload = await getPayloadClient({
    initOptions: {
      secret: process.env.PAYLOAD_SECRET,
      express: app,
      onInit: async newPayload => {
        newPayload.logger.info(`Payload Admin URL: ${newPayload.getAdminURL()}`)
      },
    },
    seed: process.env.PAYLOAD_PUBLIC_SEED === 'true',
  })

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '..'))
      process.exit()
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    port: 3000,
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info('Next.js started')

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
    })
  })
}

start()

// const start = async (): Promise<void> => {
//   const payload = await getPayloadClient({
//     initOptions: {
//       express: app,
//       onInit: async newPayload => {
//         newPayload.logger.info(`Payload Admin URL: ${newPayload.getAdminURL()}`)
//       },
//     },
//     seed: process.env.PAYLOAD_PUBLIC_SEED === 'true',
//   })

//   if (process.env.NEXT_BUILD) {
//     app.listen(PORT, async () => {
//       payload.logger.info(`Next.js is now building...`)
//       // @ts-expect-error
//       await nextBuild(path.join(__dirname, '../'))
//       process.exit()
//     })

//     return
//   }

//   const nextApp = next({
//     dev: process.env.NODE_ENV !== 'production',
//   })

//   const nextHandler = nextApp.getRequestHandler()

//   app.use((req, res) => nextHandler(req, res))

//   nextApp.prepare().then(() => {
//     payload.logger.info('Next.js started')

//     app.listen(PORT, async () => {
//       payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
//     })
//   })
// }
