import express from 'express';
import { CONNECT_DB, GET_DB } from '~/config/mongodb';

const START_SERVER = () => {
  const app = express();
  const hostname = 'localhost';
  const port = 2903;

  app.get('/', async (req, res) => {
    try {
      const db = await GET_DB();
      const collections = await db.listCollections().toArray();
      console.log(collections);
      res.end('<h1>Hello World!</h1><hr>');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }

  });

  app.listen(port, hostname, () => {
    console.log(`Hello Huynh Trong Tin, Back-end Server is running successfully at http://${hostname}:${port}/`);
  });
};

CONNECT_DB()
  .then(() => {
    console.log('Connected to MongoDB Cloud Atlas!');
    START_SERVER();
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
