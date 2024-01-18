// This file can crate a simple seed script to populate the roles collection with some initial data.
import { connect } from '../server/database';

// import the model and modify the data as needed
import { LoginMethod as UpdatingRepository } from '../models';
const data = [
  { name: 'email' },
  { name: 'google' },
  { name: 'github' }
];

export async function loginMethods() {
  const connection = await connect();
  if (!connection) {
    console.error('Failed to establish database connection');
    return;
  }
  const repository = connection.getMongoRepository(UpdatingRepository);

  // Clear the roles collection
  try {
    await repository.clear();
  } catch (error) {
    // Ignore the error because it means that the collection doesn't exist
  }

  // Seed the roles collection
  for (const i of data) {
    const newCollection = repository.create(i);
    await repository.save(newCollection);
  }
}