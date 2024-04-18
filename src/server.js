import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB,CLOSE_DB } from '~/config/mongodb'
import {env} from '~/config/environment'
import {APIs_V1} from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use('/v1',APIs_V1 )
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/
    `)
  })

  // Thực hiện các tụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas!')
  })
}

// Chỉ khi kết nối tới Database thành công mới Start Server Back-end lên.
(async () => {
  try{
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    
    //Khởi tạo Server Back-end sau khi đã Connect Database thành công
    START_SERVER()
  } catch(error) {
    console.error(error)
    process.exit(0)
  }

})()