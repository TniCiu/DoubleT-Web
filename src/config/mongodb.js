import { MongoClient,ServerApiVersion } from 'mongodb'
import {env} from '~/config/environment'


// Khởi tạo một đối tượng DoubleTDatabaseInstance ban đầu là null (vì tôi chưa connect)
let DoubleTDatabaseInstance = null

// Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI,{
    // ServerApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    // }
})

// Kết nối tới Database
export const CONNECT_DB = async () =>{
    await mongoClientInstance.connect()

    // kết nối thành công thì lấy ra database theo tên và gán ngược nó lại biến DoubleTDatabaseInstance ở trên 
    DoubleTDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)

}

// Đóng kết nối tới Database khi cần 
export const CLOSE_DB = async () => {

    await mongoClientInstance.close()

}

// lưu ý phải đảm bảo chỉ luôn gọi cái getdb này sau khi đã kết nối thành công tới mongodb
export const GET_DB = () =>{
    if(!DoubleTDatabaseInstance) throw new Error('Must connect to Database first!')
    return DoubleTDatabaseInstance
}

