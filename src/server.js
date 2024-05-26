// Trước khi import các module khác, bạn có thể cấu hình Cloudinary
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
  cloud_name: 'ddmsl3meg', 
  api_key: '961362291431251', 
  api_secret: '7eUMxe_QPIjpcjLqTtEh3tkgwhY' 
});

// Tiếp theo, bạn có thể import các module khác và tiếp tục với logic của ứng dụng
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))
  app.use(express.json({ limit: '50mb' }))
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3.Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    console.log('4.Disconnecting from MongoDB Cloud Atlas')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDB Cloud Atlas!')
  })
}

(async () => {
  try {
    console.log('1.Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
