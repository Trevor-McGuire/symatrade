// This file can crate a simple seed script to populate the roles collection with some initial data.
import { connect } from '../server/database';

// import the model and modify the data as needed
import { User as UpdatingRepository } from '../models';

export async function users() {
  const connection = await connect();
  if (!connection) {
    console.error('Failed to establish database connection');
    return;
  }
  const repository = connection.getMongoRepository(UpdatingRepository);

  try {
    await repository.clear();
  } catch (error) {
    // Ignore the error because it means that the collection doesn't exist
  }
}