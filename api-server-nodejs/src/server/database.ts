import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import User from '../models/user';
import ActiveSession from '../models/activeSession';
import Role from '../models/role';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

const options: ConnectionOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: true,
  entities: [User, ActiveSession, Role],
};

export let connection : Connection | undefined;

export const connect = async (): Promise<Connection | undefined> => {
  try {
    console.log("before createConnection");
    console.log("options", options);
    const conn = await createConnection(options);
    console.log("after createConnection");
    connection = conn;
    console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
  } catch (err) {
    console.error('Error while connecting to the database', err);
  }
  return connection;
};