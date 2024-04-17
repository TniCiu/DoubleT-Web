import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB,CLOSE_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 2903

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray() )

    res.end('<h1>Hello World!</h1><hr>');
    
    })
  
  app.listen(port, hostname, () => {
    console.log(`3. Hello Huynh Trong Tin, Back-end Server is running successfully at http://${hostname}:${port}/
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