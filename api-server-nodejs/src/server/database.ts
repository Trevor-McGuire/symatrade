import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import * as models from '../models';
import { config } from 'dotenv';
config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not sett.');
}

const options: ConnectionOptions = {
  type: 'mongodb',
  url: (process.env.CONNECT_TO === 'local') ? process.env.LOCAL_DATABASE_URI : process.env.MONGODB_URI,
  synchronize: true,
  logging: true,
  entities: Object.values(models),
};

export let connection : Connection | undefined;

export const connect = async (): Promise<Connection | undefined> => {
  try {
    console.log(`Connecting to the database...`);
    const conn = await createConnection(options);
    connection = conn;
    console.log(`Database connection success.`);
  } catch (err) {
    console.error('Error while connecting to the database', err);
  }
  return connection;
};